package com.example.android_app.entity;
import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;
import androidx.room.TypeConverters;

import com.example.android_app.core.Converters;
import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Entity(tableName = "mails")
public class Mail implements Serializable {
    @PrimaryKey
    @NonNull
    @SerializedName("id")
    private String id;

    private String from;

    @TypeConverters(Converters.class)
    private List<String> to;

    private String subject;
    private String content;
    private String owner;

    @TypeConverters(Converters.class)
    private Date timestamp;

    @TypeConverters(Converters.class)
    private Date deletedAt;

    private boolean isSpam;
    private boolean isDraft;
    private boolean isStarred;
    private boolean isDeleted;
    private boolean isRead;

    @TypeConverters(Converters.class)
    private List<String> labels;

    public Mail() {}

    public Mail(String subject) {
        this.subject = subject;
    }

    public String getId() { return id; }
    public String getFrom() { return from; }
    public List<String> getTo() { return to; }
    public String getSubject() { return subject; }
    public String getContent() { return content; }
    public String getOwner() { return owner; }
    public Date getTimestamp() { return timestamp; }
    public Date getDeletedAt() { return deletedAt; }
    public boolean isSpam() { return isSpam; }
    public boolean isDraft() { return isDraft; }
    public boolean isStarred() { return isStarred; }
    public boolean isDeleted() { return isDeleted; }
    public boolean isRead() { return isRead; }
    public List<String> getLabels() { return labels; }
    public void setId(String id) { this.id = id; }
    public void setFrom(String from) { this.from = from; }
    public void setTo(List<String> to) { this.to = to; }
    public void setSubject(String subject) { this.subject = subject; }
    public void setContent(String content) { this.content = content; }
    public void setOwner(String owner) { this.owner = owner; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
    public void setDeletedAt(Date deletedAt) { this.deletedAt = deletedAt; }
    public void setSpam(boolean spam) { isSpam = spam; }
    public void setDraft(boolean draft) { isDraft = draft; }
    public void setStarred(boolean starred) { isStarred = starred; }
    public void setDeleted(boolean deleted) { isDeleted = deleted; }
    public void setRead(boolean read) { isRead = read; }
    public void setLabels(List<String> labels) { this.labels = labels; }

    @Override
    public String toString() {
        return subject;
    }
}
