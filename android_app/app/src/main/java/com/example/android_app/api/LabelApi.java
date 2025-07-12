package com.example.android_app.api;

import com.example.android_app.entity.Label;

import java.util.List;
import java.util.Map;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface LabelApi {
    @GET("labels")
    Call<List<Label>> getLabels(
            @Header("Authorization") String token
    );

    @POST("labels")
    Call<ResponseBody> addLabel(
            @Header("Authorization") String token,
            @Body Label label
    );

    @PATCH("labels/{id}")
    Call<Label> updateLabel(
            @Header("Authorization") String token,
            @Path("id") String labelId,
            @Body Map<String, String> nameMap
    );

    @DELETE("labels/{id}")
    Call<ResponseBody> deleteLabel(
            @Header("Authorization") String token,
            @Path("id") String labelId
    );

    @GET("labels/{id}")
    Call<Label> getLabelById(
            @Header("Authorization") String token,
            @Path("id") String labelId
    );
}