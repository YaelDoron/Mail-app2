package com.example.android_app.viewmodel;

import android.app.Application;
import android.content.Context;
import android.net.Uri;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;

import com.example.android_app.entity.User;
import com.example.android_app.repository.UserRepository;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

public class UserViewModel extends AndroidViewModel {

    private final UserRepository userRepository;

    public UserViewModel(@NonNull Application application) {
        super(application);
        userRepository = new UserRepository(application.getApplicationContext());
    }

    public void signIn(String email, String password) {
        userRepository.signIn(email, password);
    }

    public void register(Map<String, Object> payload) {
        Map<String, String> safePayload = new HashMap<>();
        for (Map.Entry<String, Object> entry : payload.entrySet()) {
            if (entry.getValue() != null) {
                safePayload.put(entry.getKey(), entry.getValue().toString());
            }
        }
        userRepository.register(safePayload);
    }

    public LiveData<Boolean> getLoginSuccess() {
        return userRepository.getLoginSuccess();
    }

    public LiveData<Boolean> getRegisterSuccess() {
        return userRepository.getRegisterSuccess();
    }

    public LiveData<String> getErrorMessage() {
        return userRepository.getErrorMessage();
    }

    public LiveData<User> getCurrentUser() {
        return userRepository.getCurrentUser();
    }

    public LiveData<String> fetchUserIdByEmail(String email) {
        return userRepository.fetchUserIdByEmail(email);
    }

    public LiveData<User> fetchUserById(String userId) {
        return userRepository.fetchUserById(userId);
    }

    public void uploadProfileImage(Context context, String token, Uri uri, User currentUser) {
        userRepository.uploadProfileImage(context, token, uri, currentUser);
    }
}