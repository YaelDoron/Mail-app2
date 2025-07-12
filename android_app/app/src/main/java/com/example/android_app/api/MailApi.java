package com.example.android_app.api;

import com.example.android_app.entity.Mail;

import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface MailApi {
    @GET("mails")
    Call<List<Mail>> getInboxMails(
            @Header("Authorization") String token
    );

    @POST("mails")
    Call<Mail> createMail(
            @Header("Authorization") String token,
            @Body Mail mail
    );

    @GET("mails/all")
    Call<List<Mail>> getAllMails(
            @Header("Authorization") String token
    );

    @GET("mails/sent")
    Call<List<Mail>> getSentMails(
            @Header("Authorization") String token
    );

    @GET("mails/trash")
    Call<List<Mail>> getTrashMails(
            @Header("Authorization") String token
    );

    @GET("mails/star")
    Call<List<Mail>> getStarredMails(
            @Header("Authorization") String token
    );

    @GET("mails/spam")
    Call<List<Mail>> getSpamMails(
            @Header("Authorization") String token
    );

    @GET("mails/draft")
    Call<List<Mail>> getDraftMails(
            @Header("Authorization") String token
    );

    @GET("mails/{id}")
    Call<Mail> getMailById(
            @Header("Authorization") String token,
            @Path("id") String mailId
    );

    @PATCH("mails/read/{id}")
    Call<Void> markAsRead(
            @Header("Authorization") String token,
            @Path("id") String mailId
    );

    @PATCH("mails/star/{id}")
    Call<Mail> toggleStarred(
            @Header("Authorization") String token,
            @Path("id") String mailId
    );

    @PATCH("mails/spam/{id}")
    Call<Mail> toggleSpam(
            @Header("Authorization") String token,
            @Path("id") String mailId
    );

    @PATCH("mails/labels/{id}")
    Call<Mail> assignLabels(
            @Header("Authorization") String token,
            @Path("id") String mailId,
            @Body Map<String, List<String>> labelMap
    );

    @PATCH("mails/unassign-label/{id}")
    Call<Mail> unassignLabel(
            @Header("Authorization") String token,
            @Path("id") String mailId,
            @Body Map<String, String> labelMap
    );

    @PATCH("mails/{id}")
    Call<Mail> updateDraft(
            @Header("Authorization") String token,
            @Path("id") String mailId,
            @Body Mail updates
    );

    @POST("mails/send/{id}")
    Call<Void> sendDraft(
            @Header("Authorization") String token,
            @Path("id") String mailId
    );

    @DELETE("mails/{id}")
    Call<Void> deleteMail(
            @Header("Authorization") String token,
            @Path("id") String mailId
    );

    @PATCH("mails/restore/{id}")
    Call<Void> restoreMail(
            @Header("Authorization") String token,
            @Path("id") String mailId
    );

    @POST("mails/by-label")
    Call<List<Mail>> getMailsByLabel(
            @Header("Authorization") String token,
            @Body Map<String, String> body
    );

    @GET("mails/trash/{id}")
    Call<Mail> getDeletedMailById(
            @Header("Authorization") String token,
            @Path("id") String mailId
    );

    @GET("mails/search/{query}")
    Call<List<Mail>> searchMails(
            @Header("Authorization") String token,
            @Path("query") String query
    );
}