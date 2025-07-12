package com.example.android_app.ui;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.MultiAutoCompleteTextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;

import com.example.android_app.R;
import com.example.android_app.core.MyApplication;
import com.example.android_app.entity.Mail;
import com.example.android_app.core.utils.FormValidator;
import com.example.android_app.entity.User;
import com.example.android_app.viewmodel.MailViewModel;
import com.example.android_app.viewmodel.UserViewModel;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class MailSendActivity extends AppCompatActivity {
    private String draftMailId = null;

    private ImageView backButton, saveDraftButton;
    private EditText emailSubject, emailBody;
    private MultiAutoCompleteTextView recipientEmail;
    private Button sendEmailButton, deleteDraftButton;

    private MailViewModel mailViewModel;
    private UserViewModel userViewModel;

    private final List<String> userIds = new ArrayList<>();
    private final Set<String> parsedEmails = new HashSet<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_mail_send);

        emailBody = findViewById(R.id.emailBody);
        backButton = findViewById(R.id.backButton);
        emailSubject = findViewById(R.id.emailSubject);
        recipientEmail = findViewById(R.id.recipientEmail);
        sendEmailButton = findViewById(R.id.sendEmailButton);
        saveDraftButton = findViewById(R.id.saveDraftButton);
        deleteDraftButton = findViewById(R.id.deleteDraftButton);

        backButton.setOnClickListener(v -> finish());
        saveDraftButton.setOnClickListener(v -> saveDraft());
        deleteDraftButton.setOnClickListener(v -> deleteDraft());

        mailViewModel = MyApplication.getInstance().getMailViewModel();
        userViewModel = MyApplication.getInstance().getUserViewModel();

        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            draftMailId = extras.getString("id", null);

            if (draftMailId != null && !draftMailId.isEmpty()) {
                deleteDraftButton.setVisibility(View.VISIBLE);
            }

            String subject = extras.getString("subject", "");
            String content = extras.getString("content", "");
            ArrayList<String> recipients = extras.getStringArrayList("recipients");

            emailSubject.setText(subject);
            emailBody.setText(content);

            if (recipients != null) {
                for (String userId : recipients) {
                    userViewModel.fetchUserById(userId).observe(this, user -> {
                        if (user != null) {
                            String email = user.getEmail();
                            if (!parsedEmails.contains(email)) {
                                parsedEmails.add(email);
                                recipientEmail.append(email + ", ");
                                fetchUserIdByEmail(email);
                            }
                        }
                    });
                }
            }
        }

        recipientEmail.setTokenizer(new MultiAutoCompleteTextView.CommaTokenizer());
        recipientEmail.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {}

            @Override
            public void afterTextChanged(Editable s) {
                String[] parts = s.toString().split(",");
                for (String raw : parts) {
                    String email = raw.trim();

                    if (email.length() > 5 && !parsedEmails.contains(email) && FormValidator.isEmailValid(email)) {
                        parsedEmails.add(email);
                        fetchUserIdByEmail(email);
                    }
                }
            }
        });

        sendEmailButton.setOnClickListener(v -> sendMail());
    }

    private void deleteDraft() {
        if (draftMailId != null && !draftMailId.isEmpty()) {
            mailViewModel.deleteMail(draftMailId);
            Toast.makeText(this, "Draft deleted", Toast.LENGTH_SHORT).show();
            finish();
        }
    }

    private void fetchUserIdByEmail(String email) {
        userViewModel.fetchUserIdByEmail(email).observe(this, userId -> {
            if (userId != null && !userIds.contains(userId)) {
                userIds.add(userId);
            }
        });
    }

    private void sendMail() {
        String subject = emailSubject.getText().toString().trim();
        String content = emailBody.getText().toString().trim();

        if (userIds.isEmpty() || subject.isEmpty() || content.isEmpty()) {
            Toast.makeText(this, "Please fill all fields and wait for email resolution", Toast.LENGTH_SHORT).show();
            return;
        }

        userViewModel.getCurrentUser().observe(this, new Observer<User>() {
            @Override
            public void onChanged(User user) {
                if (user != null) {
                    Mail mail = new Mail();
                    mail.setFrom(user.getId());
                    mail.setTo(userIds);
                    mail.setSubject(subject);
                    mail.setContent(content);
                    mail.setTimestamp(new Date());
                    mail.setOwner(user.getId());

                    mailViewModel.createMail(mail);
                    finish();
                }
            }
        });
    }

    private void saveDraft() {
        String subject = emailSubject.getText().toString().trim();
        String content = emailBody.getText().toString().trim();

        if (subject.isEmpty() && content.isEmpty() && userIds.isEmpty()) {
            Toast.makeText(this, "Cannot save empty draft", Toast.LENGTH_SHORT).show();
            return;
        }

        userViewModel.getCurrentUser().observe(this, user -> {
            if (user != null) {
                Mail mail = new Mail();
                mail.setFrom(user.getId());
                mail.setTo(userIds);
                mail.setSubject(subject);
                mail.setContent(content);
                mail.setTimestamp(new Date());
                mail.setOwner(user.getId());
                mail.setDraft(true);

                if (draftMailId != null && !draftMailId.isEmpty()) {
                    mailViewModel.updateDraft(draftMailId, mail);
                    Toast.makeText(this, "Draft updated", Toast.LENGTH_SHORT).show();
                } else {
                    mailViewModel.createMail(mail);
                    Toast.makeText(this, "Draft saved", Toast.LENGTH_SHORT).show();
                }

                finish();
            }
        });
    }
}
