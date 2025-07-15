package com.example.android_app.viewmodel;

import android.app.Application;
import android.content.Context;
import android.net.Uri;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;

import com.example.android_app.core.utils.FileUtils;
import com.example.android_app.entity.User;
import com.example.android_app.repository.UserRepository;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;

public class UserViewModel extends AndroidViewModel {

    private final UserRepository userRepository;

    public UserViewModel(@NonNull Application application) {
        super(application);
        userRepository = new UserRepository(application.getApplicationContext());
    }

    public void signIn(String email, String password) {
        userRepository.signIn(email, password);
    }

    public void registerWithImage(Context context, Map<String, Object> payload, Uri imageUri) {
        Map<String, RequestBody> dataMap = new HashMap<>();
        for (Map.Entry<String, Object> entry : payload.entrySet()) {
            if (entry.getValue() != null) {
                dataMap.put(entry.getKey(), RequestBody.create(MediaType.parse("text/plain"), entry.getValue().toString()));
            }
        }

        MultipartBody.Part imagePart = null;
        if (imageUri != null) {
            String path = FileUtils.getPath(context, imageUri);
            if (path != null) {
                File file = new File(path);
                RequestBody fileBody = RequestBody.create(MediaType.parse("image/*"), file);
                imagePart = MultipartBody.Part.createFormData("image", file.getName(), fileBody);
            }
        }

        userRepository.registerWithImage(dataMap, imagePart);
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

    public void resetLoginState() {
        userRepository.resetLoginState();
    }
}