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

    //  תיבת דואר נכנס
    @Query("SELECT * FROM mails WHERE owner = :userId AND isDeleted = 0 AND isDraft = 0 AND isSpam = 0 ORDER BY timestamp DESC")
    LiveData<List<Mail>> getInbox(String userId);

    //  מסומנים בכוכב
    @Query("SELECT * FROM mails WHERE owner = :userId AND isDeleted = 0 AND isStarred = 1 ORDER BY timestamp DESC")
    LiveData<List<Mail>> getStarred(String userId);

    //  מיילים שנשלחו
    @Query("SELECT * FROM mails WHERE owner = :userId AND from = :userId AND isDraft = 0 AND isDeleted = 0 ORDER BY timestamp DESC")
    LiveData<List<Mail>> getSent(String userId);

    //  כל המיילים (למעט נמחקים)
    @Query("SELECT * FROM mails WHERE owner = :userId AND isDeleted = 0 ORDER BY timestamp DESC")
    LiveData<List<Mail>> getAllMails(String userId);

    // ספאם
    @Query("SELECT * FROM mails WHERE owner = :userId AND isDeleted = 0 AND isSpam = 1 ORDER BY timestamp DESC")
    LiveData<List<Mail>> getSpam(String userId);

    // ️ טיוטות
    @Query("SELECT * FROM mails WHERE owner = :userId AND isDeleted = 0 AND isDraft = 1 ORDER BY timestamp DESC")
    LiveData<List<Mail>> getDrafts(String userId);

    // ️ דואר שנמחק
    @Query("SELECT * FROM mails WHERE owner = :userId AND isDeleted = 1 ORDER BY deletedAt DESC")
    LiveData<List<Mail>> getTrash(String userId);

    //  לפי מזהה
    @Query("SELECT * FROM mails WHERE id = :mailId AND owner = :userId LIMIT 1")
    LiveData<Mail> getMailById(String mailId, String userId);

    // מיילים לפי תווית
    @Query("SELECT * FROM mails WHERE owner = :userId AND isDeleted = 0 AND labels LIKE '%' || :label || '%' ORDER BY timestamp DESC")
    LiveData<List<Mail>> getByLabel(String userId, String label);

    //  הכנסת מייל בודד
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insert(Mail mail);

    //  הכנסת רשימת מיילים
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertAll(List<Mail> mails);

    //  ניקוי טבלת מיילים
    @Query("DELETE FROM mails")
    void clear();
}
