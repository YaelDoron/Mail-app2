package com.example.android_app.dao;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;

import com.example.android_app.entity.Mail;

import java.util.List;

@Dao
public interface MailDao {
    @Query("SELECT * FROM mails WHERE owner = :userId AND isDeleted = 0 AND isDraft = 0 AND isSpam = 0 ORDER BY timestamp DESC")
    LiveData<List<Mail>> getInbox(String userId);

    @Query("SELECT * FROM mails WHERE owner = :userId AND isDeleted = 0 AND isStarred = 1 ORDER BY timestamp DESC")
    LiveData<List<Mail>> getStarred(String userId);

    @Query("SELECT * FROM mails WHERE owner = :userId AND `from` = :userId AND isDraft = 0 AND isDeleted = 0 ORDER BY timestamp DESC")
    LiveData<List<Mail>> getSent(String userId);

    @Query("SELECT * FROM mails WHERE owner = :userId AND isDeleted = 0 ORDER BY timestamp DESC")
    LiveData<List<Mail>> getAllMails(String userId);

    @Query("SELECT * FROM mails WHERE owner = :userId AND isDeleted = 0 AND isSpam = 1 ORDER BY timestamp DESC")
    LiveData<List<Mail>> getSpam(String userId);

    @Query("SELECT * FROM mails WHERE owner = :userId AND isDeleted = 0 AND isDraft = 1 ORDER BY timestamp DESC")
    LiveData<List<Mail>> getDrafts(String userId);

    @Query("SELECT * FROM mails WHERE owner = :userId AND isDeleted = 1 ORDER BY deletedAt DESC")
    LiveData<List<Mail>> getTrash(String userId);

    @Query("SELECT * FROM mails WHERE id = :mailId AND owner = :userId LIMIT 1")
    LiveData<Mail> getMailById(String mailId, String userId);

    @Query("SELECT * FROM mails WHERE owner = :userId AND isDeleted = 0 AND labels LIKE '%' || :label || '%' ORDER BY timestamp DESC")
    LiveData<List<Mail>> getByLabel(String userId, String label);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insert(Mail mail);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertAll(List<Mail> mails);

    @Query("DELETE FROM mails")
    void clear();
}