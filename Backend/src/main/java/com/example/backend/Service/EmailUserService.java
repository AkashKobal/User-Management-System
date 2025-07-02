package com.example.backend.Service;


import com.example.backend.DTO.RequestResponse;

public interface EmailUserService {

    RequestResponse register(RequestResponse registerRequest);
    RequestResponse verifyOtp(String email, String otp);

}