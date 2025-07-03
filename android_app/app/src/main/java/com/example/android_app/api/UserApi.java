package com.example.android_app.api;

import com.example.android_app.entity.User;
import com.example.android_app.response.TokenResponse;

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
import retrofit2.http.Part;
import retrofit2.http.PartMap;


 // Retrofit API interface for user-related operations such as sign-in and sign-up.
public interface UserApi {
    /**
     * Sends a login request to the server with user credentials.
     * The request body is a JSON map containing "email" and "password".
     *
     * @param credentials A map of login credentials.
     * @return A Call that returns a TokenResponse on success.
     */
    @POST("tokens")
    Call<TokenResponse> signIn(@Body Map<String, String> credentials);

     // Sends a sign-up request with a profile picture
    @Multipart
    @POST("users")
    Call<ResponseBody> signUp(
            @Part MultipartBody.Part image,
            @PartMap Map<String, RequestBody> credentials
    );

     // Sends a sign-up request without a profile picture
    @Multipart
    @POST("users")
    Call<ResponseBody> signUp(
            @PartMap Map<String, RequestBody> credentials
    );

    @GET("users/current")
    Call<User> getCurrentUser(
            @Header("Authorization") String token
    );

 }
