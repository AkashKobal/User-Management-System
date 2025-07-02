package com.example.backend.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.DTO.RequestResponse;
import com.example.backend.Models.NewUsers;
import com.example.backend.Repository.NewUsersRepository;

@Service
public class NewUsersManagementService {

    @Autowired
    private NewUsersRepository newUsersRepository;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public RequestResponse registerUser(RequestResponse registrationRequest) {
        RequestResponse response = new RequestResponse();
        try {
            if (newUsersRepository.findByEmail(registrationRequest.getEmail()).isPresent()) {
                response.setStatusCode(409); // Conflict
                response.setMessage("User already exists");
                return response;
            }

            NewUsers users = new NewUsers();
            users.setName(registrationRequest.getName());
            users.setEmail(registrationRequest.getEmail());
            users.setRole(registrationRequest.getRole());
            users.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
            users.setActive(true);

            NewUsers userResult = newUsersRepository.save(users);
            response.setUsers(userResult);
            response.setStatusCode(201); // Created
            response.setMessage("User registered successfully");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Internal Server Error");
            response.setError(e.getMessage());
        }
        return response;
    }

    public RequestResponse login(RequestResponse loginRequest) {
        RequestResponse response = new RequestResponse();

        try {
            // Step 1: Check if user exists
            Optional<NewUsers> optionalUser = newUsersRepository.findByEmail(loginRequest.getEmail());
            if (optionalUser.isEmpty()) {
                response.setStatusCode(404); // Not Found
                response.setMessage("User not found");
                return response;
            }

            NewUsers user = optionalUser.get();

            // Step 2: Authenticate credentials
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            // Step 4: Generate tokens
            var jwt = jwtUtils.generateToken(user);
            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);

            // Step 5: Return success response
            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRefreshToken(refreshToken);
            response.setRole(user.getRole());
            response.setExpirationTime("24Hrs");
            response.setMessage("Successfully Logged In");

        } catch (AuthenticationException e) {
            response.setStatusCode(401); // Unauthorized
            response.setMessage("Invalid email or password");
        } catch (Exception e) {
            response.setStatusCode(500); // Internal Server Error
            response.setMessage("Internal Server Error: " + e.getMessage());
        }

        return response;
    }


    public RequestResponse refreshToken(RequestResponse refreshTokenRequest) {
        RequestResponse response = new RequestResponse();
        try {
            String ourEmail = jwtUtils.extractUsername(refreshTokenRequest.getToken());
            NewUsers users = newUsersRepository.findByEmail(ourEmail).orElseThrow();
            if (jwtUtils.isTokenValid(refreshTokenRequest.getToken(), users)) {
                var jwt = jwtUtils.generateToken(users);
                response.setStatusCode(200);
                response.setToken(jwt);
                response.setRefreshToken(refreshTokenRequest.getToken());
                response.setExpirationTime("24Hr");
                response.setMessage("Token refreshed");
            } else {
                response.setStatusCode(401); // Unauthorized
                response.setMessage("Invalid refresh token");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Internal Server Error");
        }
        return response;
    }

    public RequestResponse getAllUsers() {
        RequestResponse response = new RequestResponse();
        try {
            List<NewUsers> result = newUsersRepository.findAll();
            if (!result.isEmpty()) {
                response.setUsersList(result);
                response.setStatusCode(200);
                response.setMessage("Users fetched successfully");
            } else {
                response.setStatusCode(204); // No Content
                response.setMessage("No users found");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Internal Server Error");
        }
        return response;
    }

    public RequestResponse getUsersById(Integer id) {
        RequestResponse response = new RequestResponse();
        try {
            NewUsers user = newUsersRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User Not found"));
            response.setUsers(user);
            response.setStatusCode(200);
            response.setMessage("User found");
        } catch (Exception e) {
            response.setStatusCode(404);
            response.setMessage("User not found");
        }
        return response;
    }

    public RequestResponse deleteUser(Integer userId) {
        RequestResponse response = new RequestResponse();
        try {
            Optional<NewUsers> userOptional = newUsersRepository.findById(userId);
            if (userOptional.isPresent()) {
                newUsersRepository.deleteById(userId);
                response.setStatusCode(204); // No Content
                response.setMessage("User deleted successfully");
            } else {
                response.setStatusCode(404);
                response.setMessage("User not found");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Internal Server Error");
        }
        return response;
    }

    public RequestResponse updateUser(Integer userId, NewUsers updatedUser) {
        RequestResponse response = new RequestResponse();
        try {
            Optional<NewUsers> userOptional = newUsersRepository.findById(userId);
            if (userOptional.isPresent()) {
                NewUsers existingUser = userOptional.get();
                existingUser.setEmail(updatedUser.getEmail());
                existingUser.setName(updatedUser.getName());
                existingUser.setRole(updatedUser.getRole());
                existingUser.setUpdatedAt(LocalDateTime.now());
                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                    existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                }
                NewUsers savedUser = newUsersRepository.save(existingUser);
                response.setUsers(savedUser);
                response.setStatusCode(200);
                response.setMessage("User updated successfully");
            } else {
                response.setStatusCode(404);
                response.setMessage("User not found");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Internal Server Error");
        }
        return response;
    }

    public RequestResponse getMyInfo(String email) {
        RequestResponse response = new RequestResponse();
        try {
            Optional<NewUsers> userOptional = newUsersRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                response.setUsers(userOptional.get());
                response.setStatusCode(200);
                response.setMessage("User info fetched");
            } else {
                response.setStatusCode(404);
                response.setMessage("User not found");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Internal Server Error");
        }
        return response;
    }

    public List<NewUsers> searchUsers(String keyword) {
        return newUsersRepository.searchUsers(keyword);
    }
}
