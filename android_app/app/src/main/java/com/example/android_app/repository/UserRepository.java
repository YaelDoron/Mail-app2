package com.example.android_app.repository;


import android.content.Context;
import android.net.Uri;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.android_app.MyApplication;
import com.example.android_app.AppDatabase;
import com.example.android_app.api.RetrofitClient;
import com.example.android_app.api.UserApi;
import com.example.android_app.dao.UserDao;
import com.example.android_app.entity.User;
import com.example.android_app.response.TokenResponse;
import com.example.android_app.utils.InputStreamRequestBody;
import com.example.android_app.R;

import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class UserRepository {

    private final UserApi userApi;
    private final Context context;
    private final UserDao userDao;
    public MutableLiveData<Boolean> isSignedUp = new MutableLiveData<>();
    public MutableLiveData<Boolean> isSignedIn = new MutableLiveData<>();
    public MutableLiveData<String> errorMessage = new MutableLiveData<>();

    public UserRepository(Context context) {
        this.context = context;

        this.userApi = RetrofitClient.getClient().create(UserApi.class);

        // Initialize Room Database
        userDao = AppDatabase.getInstance(context).userDao();
    }

    public LiveData<User> getCurrentUser() {
        return userDao.getUser();
    }


    public void signUp(User user, Uri imageUri) {
        MultipartBody.Part picturePart = null;

        try {
            if (imageUri != null) {
                InputStream inputStream = context.getContentResolver().openInputStream(imageUri);
                RequestBody pictureBody = new InputStreamRequestBody(
                        MediaType.parse("image/*"), inputStream);
                picturePart = MultipartBody.Part.createFormData
                        ("picture", "profile.jpg", pictureBody);
            }

            MediaType textPlain = MediaType.parse("text/plain");
            Map<String, RequestBody> credentials = new HashMap<>();
            credentials.put("firstName", RequestBody.create(user.getFirstName(), textPlain));
            credentials.put("lastName", RequestBody.create(user.getLastName(), textPlain));
            credentials.put("birthDate", RequestBody.create(user.getBirthDate(), textPlain));
            credentials.put("gender", RequestBody.create(user.getGender(), textPlain));
            credentials.put("email", RequestBody.create(user.getEmail(), textPlain));
            credentials.put("password", RequestBody.create(user.getPassword(), textPlain));

            Call<ResponseBody> call = (picturePart != null)
                    ? userApi.signUp(picturePart, credentials)
                    : userApi.signUp(credentials);

            call.enqueue(new Callback<ResponseBody>() {
                @Override
                public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                    if (response.isSuccessful()) {
                        isSignedUp.postValue(true);
                    } else {
                        errorMessage.postValue("Signup failed: " + response.code());
                    }
                }

                @Override
                public void onFailure(Call<ResponseBody> call, Throwable t) {
                    errorMessage.postValue("Sign-up failed: " + t.getMessage());
                }
            });

        } catch (IOException e) {
            errorMessage.postValue("Image read error: " + e.getMessage());
        }
    }

    public void signIn(String email, String password) {
        Map<String, String> credentials = new HashMap<>();
        credentials.put("email", email);
        credentials.put("password", password);

        Call<TokenResponse> call = userApi.signIn(credentials);
        call.enqueue(new Callback<TokenResponse>() {
            @Override
            public void onResponse(Call<TokenResponse> call, Response<TokenResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    String token = response.body().getToken();
                    String bearerToken = "Bearer " + token;
                    MyApplication.setToken(bearerToken);
                    Call<User> userCall = userApi.getCurrentUser(bearerToken);
                    userCall.enqueue(new Callback<User>() {
                        @Override
                        public void onResponse(Call<User> call, Response<User> userResponse) {
                            if (userResponse.isSuccessful() && userResponse.body() != null) {
                                User user = userResponse.body();
                                user.setToken(token);
                                AppDatabase.databaseWriteExecutor.execute(() -> userDao.insert(user));
                                isSignedIn.postValue(true);
                            } else {
                                errorMessage.postValue("Failed to load user data");
                            }
                        }
                        @Override
                        public void onFailure(Call<User> call, Throwable t) {
                            errorMessage.postValue("Network error: " + t.getMessage());
                        }
                    });
                } else {
                    errorMessage.postValue("Sign-in failed: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<TokenResponse> call, Throwable t) {
                errorMessage.postValue("Sign-in failed: " + t.getMessage());
            }
        });
    }


    public void logout() {
        MyApplication.setToken(null);
        AppDatabase.databaseWriteExecutor.execute(userDao::clearAllUsers);
        isSignedIn.postValue(false);
    }

}