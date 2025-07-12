package com.example.android_app.api;

import com.example.android_app.entity.User;
import com.example.android_app.core.response.TokenResponse;

import java.util.Map;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Part;
import retrofit2.http.PartMap;

public interface UserApi {
    @POST("tokens")
    Call<TokenResponse> signIn(@Body Map<String, String> credentials);

    @Multipart
    @POST("users")
    Call<ResponseBody> signUp(
            @Part MultipartBody.Part image,
            @PartMap Map<String, RequestBody> credentials
    );

    @Multipart
    @POST("users")
    Call<ResponseBody> signUp(
            @PartMap Map<String, RequestBody> credentials
    );

    @GET("users/current")
    Call<User> getCurrentUser(
            @Header("Authorization") String token
    );

    @GET("users/by-email/{email}")
    Call<Map<String, String>> getUserIdByEmail(@retrofit2.http.Path("email") String email);

    @GET("users/{id}")
    Call<User> getUserById(@retrofit2.http.Path("id") String id);

    @Multipart
    @PUT("users/image")
    Call<User> uploadProfileImage(
            @Header("Authorization") String token,
            @Part MultipartBody.Part image
    );

}