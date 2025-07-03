package com.example.android_app.viewmodel;

import android.app.Application;
import android.net.Uri;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;

import com.example.android_app.entity.User;
import com.example.android_app.repository.UserRepository;

public class UserViewModel extends AndroidViewModel {

    private final UserRepository userRepository;

    public UserViewModel(@NonNull Application application) {
        super(application);
        userRepository = new UserRepository(application.getApplicationContext());
    }

    // expose LiveData
    public LiveData<Boolean> getIsSignedIn() {
        return userRepository.isSignedIn;
    }

    public LiveData<Boolean> getIsSignedUp() {
        return userRepository.isSignedUp;
    }

    public LiveData<String> getErrorMessage() {
        return userRepository.errorMessage;
    }

    // sign in
    public void signIn(String email, String password) {
        userRepository.signIn(email, password);
    }

    // sign up
    public void signUp(User user, Uri imageUri) {
        userRepository.signUp(user, imageUri);
    }

    // logout
    public void logout() {
        userRepository.logout();
    }

    public LiveData<User> getCurrentUser() {
        return userRepository.getCurrentUser();
    }

    public boolean validateCredentials(String email, String password) {
        if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
            userRepository.errorMessage.postValue("Email and password must not be empty");
            return false;
        }
        if (!email.endsWith("@mailsnap.com")) {
            userRepository.errorMessage.postValue("Email must end with @mailsnap.com");
            return false;
        }
        if (password.length() < 8) {
            userRepository.errorMessage.postValue("Password must be at least 8 characters long");
            return false;
        }
        return true;
    }


}
