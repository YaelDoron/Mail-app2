package com.example.android_app.repository;

import android.content.Context;
import android.net.Uri;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.android_app.core.AppDatabase;
import com.example.android_app.api.RetrofitClient;
import com.example.android_app.api.UserApi;
import com.example.android_app.core.utils.FileUtils;
import com.example.android_app.dao.UserDao;
import com.example.android_app.entity.User;
import com.example.android_app.core.response.TokenResponse;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class UserRepository {
    private final UserApi userApi;
    private final UserDao userDao;

    private final MutableLiveData<String> errorMessage = new MutableLiveData<>();
    private final MutableLiveData<Boolean> loginSuccess = new MutableLiveData<>();
    private final MutableLiveData<Boolean> registerSuccess = new MutableLiveData<>();

    private final MutableLiveData<User> userLiveData = new MutableLiveData<>();

    private static final String TAG = "UserRepository";

    public LiveData<User> getUserLiveData() {
        return userLiveData;
    }


    public UserRepository(Context context) {
        userDao = AppDatabase.getInstance(context).userDao();
        userApi = RetrofitClient.getClient().create(UserApi.class);
    }

    public LiveData<User> getCurrentUser() {
        return userDao.getUser();
    }

    public LiveData<Boolean> getLoginSuccess() {
        return loginSuccess;
    }

    public LiveData<String> getErrorMessage() {
        return errorMessage;
    }

    public LiveData<Boolean> getRegisterSuccess() {
        return registerSuccess;
    }

    public void registerWithImage(Map<String, RequestBody> userData, @Nullable MultipartBody.Part imagePart) {
        userApi.signUpWithImage(imagePart, userData).enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    registerSuccess.postValue(true);
                } else {
                    if (response.code() == 409) {
                        errorMessage.postValue("Email already exists");
                    } else {
                        try {
                            String serverMessage = response.errorBody() != null ? response.errorBody().string() : "Unknown error";
                            errorMessage.postValue("Registration failed: " + serverMessage);
                        } catch (IOException e) {
                            errorMessage.postValue("Registration failed: " + response.code());
                        }
                    }
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                errorMessage.postValue("Registration error: " + t.getMessage());
            }
        });
    }
    public void resetLoginState() {
        loginSuccess.postValue(false);
        errorMessage.postValue(null);
    }

    public void resetRegisterState() {
        registerSuccess.postValue(false);
        errorMessage.postValue(null);
    }


    public void signIn(String email, String password) {
        Map<String, String> credentials = new HashMap<>();
        credentials.put("email", email);
        credentials.put("password", password);

        userApi.signIn(credentials).enqueue(new Callback<TokenResponse>() {
            @Override
            public void onResponse(Call<TokenResponse> call, Response<TokenResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    String token = response.body().getToken();
                    fetchUserDetails(email, token);
                } else {
                    errorMessage.postValue("Login failed: Invalid credentials");
                }
            }

            @Override
            public void onFailure(Call<TokenResponse> call, Throwable t) {
                errorMessage.postValue("Login failed: " + t.getMessage());
            }
        });
    }

    private void fetchUserDetails(String email, String token) {
        userApi.getUserIdByEmail(email).enqueue(new Callback<Map<String, String>>() {
            @Override
            public void onResponse(Call<Map<String, String>> call, Response<Map<String, String>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    String userId = response.body().get("id");
                    fetchUserById(userId, token);
                } else {
                    errorMessage.postValue("Failed to fetch user ID");
                }
            }

            @Override
            public void onFailure(Call<Map<String, String>> call, Throwable t) {
                errorMessage.postValue("User ID fetch error: " + t.getMessage());
            }
        });
    }

    private void fetchUserById(String userId, String token) {
        userApi.getUserById(userId).enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response.isSuccessful() && response.body() != null) {
                    User user = response.body();
                    user.setToken(token);
                    saveUserToDatabase(user);
                } else {
                    errorMessage.postValue("Failed to fetch user details");
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                errorMessage.postValue("User fetch error: " + t.getMessage());
            }
        });
    }

    private void saveUserToDatabase(User user) {
        AppDatabase.databaseWriteExecutor.execute(() -> {
            userDao.insert(user);
            loginSuccess.postValue(true);
        });
    }

    public LiveData<User> fetchUserById(String userId) {
        MutableLiveData<User> result = new MutableLiveData<>();

        userApi.getUserById(userId).enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response.isSuccessful() && response.body() != null) {
                    result.setValue(response.body());
                } else {
                    result.setValue(null);
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                result.setValue(null);
            }
        });

        return result;
    }

    public LiveData<String> fetchUserIdByEmail(String email) {
        MutableLiveData<String> result = new MutableLiveData<>();
        UserApi userApi = RetrofitClient.getClient().create(UserApi.class);

        userApi.getUserIdByEmail(email).enqueue(new Callback<Map<String, String>>() {
            @Override
            public void onResponse(Call<Map<String, String>> call, Response<Map<String, String>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    result.setValue(response.body().get("id"));
                } else {
                    result.setValue(null);
                }
            }

            @Override
            public void onFailure(Call<Map<String, String>> call, Throwable t) {
                result.setValue(null);
            }
        });

        return result;
    }

    public void uploadProfileImage(Context context, String token, Uri uri, User currentUser) {
        Log.d("UserRepository", "Starting image upload");

        File file = FileUtils.getFileFromUri(context, uri);
        if (file == null || !file.exists()) {
            Log.e("UserRepository", "File is null or does not exist");
            errorMessage.postValue("Invalid image file");
            return;
        }

        Log.d("UserRepository", "File path: " + file.getAbsolutePath());
        Log.d("UserRepository", "File exists: " + file.exists());

        RequestBody requestFile = RequestBody.create(file, MediaType.parse("image/*"));
        MultipartBody.Part body = MultipartBody.Part.createFormData("image", file.getName(), requestFile);


        String authHeader = "Bearer " + token;
        Log.d("UserRepository", "Uploading with token: " + authHeader);

        userApi.uploadProfileImage(authHeader, body).enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                Log.d("UserRepository", "onResponse triggered");

                if (response.isSuccessful() && response.body() != null) {
                    Log.d(TAG, "Upload successful: " + response.body().getImage());

                    User updatedUser = response.body();
                    updatedUser.setToken(currentUser.getToken());

                    // Update DB and LiveData
                    AppDatabase.databaseWriteExecutor.execute(() -> {
                        userDao.insert(updatedUser);
                        userLiveData.postValue(updatedUser);
                    });
                } else {
                    Log.e(TAG, "Upload failed with code: " + response.code());
                    try {
                        Log.e(TAG, "Error body: " + (response.errorBody() != null ? response.errorBody().string() : "null"));
                    } catch (Exception e) {
                        Log.e(TAG, "Error parsing errorBody", e);
                    }
                    errorMessage.postValue("Image upload failed");
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                Log.e("UserRepository", "Upload failed: ", t);
                errorMessage.postValue("Upload error: " + t.getMessage());
            }
        });
    }
}