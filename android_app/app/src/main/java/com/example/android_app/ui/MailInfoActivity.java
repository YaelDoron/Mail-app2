package com.example.android_app.ui;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.PopupMenu;
import android.widget.TextView;
import android.widget.Toast;
import java.util.stream.Collectors;


import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.bumptech.glide.Glide;
import com.example.android_app.R;
import com.example.android_app.core.MyApplication;
import com.example.android_app.entity.Label;
import com.example.android_app.entity.User;
import com.example.android_app.viewmodel.LabelViewModel;
import com.example.android_app.viewmodel.MailViewModel;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MailInfoActivity extends AppCompatActivity {
    private String mailId;
    private MailViewModel mailViewModel;
    private LabelViewModel labelViewModel;
    private List<Label> currentLabels = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_mail_info);

        mailViewModel = MyApplication.getInstance().getMailViewModel();
        labelViewModel = new ViewModelProvider(this).get(LabelViewModel.class);

        ImageView backButton = findViewById(R.id.backButton);
        ImageView reportButton = findViewById(R.id.reportButton);
        ImageView deleteButton = findViewById(R.id.deleteButton);
        ImageView labelButton = findViewById(R.id.labelButton);
        ImageView restoreButton = findViewById(R.id.restoreButton);

        TextView subjectView = findViewById(R.id.mailSubject);
        TextView fromView = findViewById(R.id.mailFrom);
        TextView timeView = findViewById(R.id.mailTime);
        TextView bodyView = findViewById(R.id.mailBody);
        ImageView profileIcon = findViewById(R.id.profileIcon);

        String subject = getIntent().getStringExtra("subject");
        String from = getIntent().getStringExtra("from");
        String time = getIntent().getStringExtra("time");
        String body = getIntent().getStringExtra("body");
        mailId = getIntent().getStringExtra("id");
        String senderImage = getIntent().getStringExtra("senderImage");
        String senderEmail = getIntent().getStringExtra("senderEmail");
        boolean isTrash = getIntent().getBooleanExtra("isTrash", false);
        List<String> recipients = getIntent().getStringArrayListExtra("recipients");


        MyApplication.getInstance().getUserViewModel().getCurrentUser().observe(this, user -> {
            if (user == null) return;

            if (senderEmail != null && recipients != null) {
                if (senderEmail.equalsIgnoreCase(user.getEmail())) {
                    StringBuilder names = new StringBuilder();
                    for (String recipientId : recipients) {
                        User recipient = mailViewModel.getSender(recipientId);
                        if (recipient != null) {
                            names.append(recipient.getFirstName()).append(" ").append(recipient.getLastName()).append(", ");
                        } else {
                            names.append("Unknown, ");
                        }
                    }
                    if (names.length() > 0) names.setLength(names.length() - 2);
                    subjectView.setText(subject + " <sent to " + names + ">");
                } else {
                    subjectView.setText(subject);
                }
            } else {
                subjectView.setText(subject);
            }
        });

        fromView.setText(from);
        timeView.setText(time);
        bodyView.setText(body);

        if (senderImage != null && !senderImage.isEmpty()) {
            String fullImageUrl = "http://10.0.2.2:3000/" + senderImage.replace("\\", "/").replace(" ", "%20");
            Glide.with(this)
                    .load(fullImageUrl)
                    .placeholder(R.drawable.ic_avatar_placeholder)
                    .error(R.drawable.ic_avatar_placeholder)
                    .circleCrop()
                    .into(profileIcon);
        } else {
            profileIcon.setImageResource(R.drawable.ic_avatar_placeholder);
        }

        backButton.setOnClickListener(v -> finish());

        reportButton.setOnClickListener(v -> {
            if (mailId != null) mailViewModel.toggleSpam(mailId);
        });

        deleteButton.setOnClickListener(v -> {
            if (mailId != null) {
                mailViewModel.deleteMail(mailId);
                finish();
            }
        });

        restoreButton.setOnClickListener(v -> {
            if (mailId != null) {
                mailViewModel.restoreMail(mailId);
                finish();
            }
        });

        if (isTrash) {
            deleteButton.setVisibility(View.GONE);
            restoreButton.setVisibility(View.VISIBLE);
        } else {
            deleteButton.setVisibility(View.VISIBLE);
            restoreButton.setVisibility(View.GONE);
        }

        labelButton.setOnClickListener(v -> {
            if (currentLabels != null) {
                showLabelDialog();
            } else {
                Toast.makeText(this, "Still loading labels...", Toast.LENGTH_SHORT).show();
            }
        });

        mailViewModel.getCurrentUser().observe(this, user -> {
            if (user != null && user.getToken() != null) {
                labelViewModel.setCurrentUser(user);
                labelViewModel.fetchLabels();
            }
        });

        labelViewModel.getLabels().observe(this, labels -> {
            currentLabels = labels;
        });

        mailViewModel.getMails().observe(this, mails -> {
            if (mails != null && !mails.isEmpty() && mailId != null) {
                mailViewModel.markAsRead(mailId);
            }
        });

        mailViewModel.getErrorMessage().observe(this, msg -> {
            if (msg != null) Toast.makeText(this, msg, Toast.LENGTH_SHORT).show();
        });
    }

    private void showLabelDialog() {
        if (mailId == null || currentLabels == null || currentLabels.isEmpty()) return;

        View dialogView = getLayoutInflater().inflate(R.layout.dialog_labels, null);
        LinearLayout labelsContainer = dialogView.findViewById(R.id.labelsContainer);

        List<String> assignedLabelIds = mailViewModel.getMails().getValue()
                .stream()
                .filter(mail -> mail.getId().equals(mailId))
                .flatMap(mail -> mail.getLabels() != null ? mail.getLabels().stream() : java.util.stream.Stream.<String>empty())
                .collect(Collectors.toList());

        for (Label label : currentLabels) {
            CheckBox checkBox = new CheckBox(this);
            checkBox.setText(label.getName());
            checkBox.setTag(label.getId());
            checkBox.setChecked(assignedLabelIds.contains(label.getId()));
            labelsContainer.addView(checkBox);
        }

        new AlertDialog.Builder(this)
                .setTitle("Manage Labels")
                .setView(dialogView)
                .setPositiveButton("Save", (dialog, which) -> {
                    for (int i = 0; i < labelsContainer.getChildCount(); i++) {
                        View child = labelsContainer.getChildAt(i);
                        if (child instanceof CheckBox) {
                            CheckBox cb = (CheckBox) child;
                            String labelId = (String) cb.getTag();
                            if (cb.isChecked() && !assignedLabelIds.contains(labelId)) {
                                Map<String, List<String>> labelMap = new HashMap<>();
                                labelMap.put("labels", Collections.singletonList(labelId));
                                mailViewModel.assignLabels(mailId, labelMap);
                            } else if (!cb.isChecked() && assignedLabelIds.contains(labelId)) {
                                Map<String, String> labelMap = new HashMap<>();
                                labelMap.put("labelId", labelId);
                                mailViewModel.unassignLabel(mailId, labelMap);
                            }
                        }
                    }
                })
                .setNegativeButton("Cancel", null)
                .show();
    }
}