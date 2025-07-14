package com.example.android_app.adapters;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.example.android_app.R;
import com.example.android_app.entity.Mail;
import com.example.android_app.entity.User;
import com.example.android_app.ui.MailInfoActivity;
import com.example.android_app.ui.MailSendActivity;
import com.example.android_app.viewmodel.MailViewModel;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import android.app.Activity;

public class MailAdapter extends RecyclerView.Adapter<MailAdapter.MailViewHolder> {
    private final Context context;
    private final MailViewModel mailViewModel;
    private List<Mail> mailList = new ArrayList<>();

    public MailAdapter(Context context, MailViewModel viewModel) {
        this.context = context;
        this.mailViewModel = viewModel;
    }

    public void setMails(List<Mail> mails) {
        this.mailList = new ArrayList<>(mails);
        notifyDataSetChanged();
    }

    @Override
    public MailViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.mail_item, parent, false);
        return new MailViewHolder(view);
    }

    @Override
    public void onBindViewHolder(MailViewHolder holder, int position) {
        Mail mail = mailList.get(position);
        holder.subjectText.setText(mail.getSubject());

        String senderId = mail.getFrom();
        User sender = mailViewModel.getSender(senderId);

        if (sender == null || sender.getImage() == null || sender.getImage().isEmpty()) {
            Log.d("MailAdapter", "Sender is null or missing image. Refetching: " + senderId);
            holder.senderText.setText("Refreshing…");
            holder.senderAvatar.setImageResource(R.drawable.ic_avatar_placeholder);

            mailViewModel.fetchSender(senderId, () -> {
                int pos = holder.getAdapterPosition();
                if (pos != RecyclerView.NO_POSITION) {
                    ((Activity) context).runOnUiThread(() -> notifyItemChanged(pos));
                }
            });
            return;
        }

        holder.senderText.setText(sender.getFirstName() + " " + sender.getLastName());

        String imagePath = sender.getImage().replace("\\", "/").replace(" ", "%20");
        String fullImageUrl = "http://10.0.2.2:3000/" + imagePath;

        Glide.with(context)
                .load(fullImageUrl)
                .placeholder(R.drawable.ic_avatar_placeholder)
                .error(R.drawable.ic_avatar_placeholder)
                .circleCrop()
                .into(holder.senderAvatar);

        String formattedDate = new SimpleDateFormat("MMM d, h:mm a", Locale.getDefault())
                .format(mail.getTimestamp());
        holder.timeText.setText(formattedDate);

        updateStarIcon(holder, mail.isStarred());
        updateReadState(holder, mail.isRead());

        holder.starIcon.setOnClickListener(v -> {
            mailViewModel.toggleStarred(mail.getId());
        });

        holder.itemView.setOnClickListener(v -> {
            Intent intent;
            if (mail.isDraft()) {
                intent = new Intent(context, MailSendActivity.class);
                intent.putExtra("id", mail.getId());
                intent.putExtra("subject", mail.getSubject());
                intent.putExtra("content", mail.getContent());
                intent.putStringArrayListExtra("recipients", new ArrayList<>(mail.getTo()));
            } else {
                intent = new Intent(context, MailInfoActivity.class);
                intent.putExtra("id", mail.getId());
                intent.putExtra("subject", mail.getSubject());
                intent.putExtra("from", sender.getFirstName() + " " + sender.getLastName());
                intent.putExtra("time", formattedDate);
                intent.putExtra("senderImage", sender.getImage());
                intent.putExtra("senderEmail", sender.getEmail());
                intent.putExtra("body", mail.getContent());
                intent.putExtra("recipients", new ArrayList<>(mail.getTo()));
                intent.putExtra("isTrash", mail.isDeleted());
            }
            context.startActivity(intent);
        });
    }

    private void updateReadState(MailViewHolder holder, boolean isRead) {
        int backgroundColor = ContextCompat.getColor(context,
                isRead ? R.color.colorSurface : R.color.colorBackground);
        int textColor = ContextCompat.getColor(context,
                isRead ? R.color.colorOnSurfaceVariant : R.color.colorOnSurface);

        holder.itemView.setBackgroundColor(backgroundColor);
        holder.subjectText.setTextColor(textColor);
    }

    private void updateStarIcon(MailViewHolder holder, boolean isStarred) {
        holder.starIcon.setImageResource(
                isStarred ? R.drawable.ic_star : R.drawable.ic_star_border
        );
    }

    @Override
    public int getItemCount() {
        return mailList.size();
    }

    static class MailViewHolder extends RecyclerView.ViewHolder {
        ImageView starIcon, senderAvatar;
        TextView senderText, subjectText, timeText;

        MailViewHolder(View itemView) {
            super(itemView);
            starIcon = itemView.findViewById(R.id.starIcon);
            senderAvatar = itemView.findViewById(R.id.avatarImage);
            senderText = itemView.findViewById(R.id.senderText);
            subjectText = itemView.findViewById(R.id.subjectText);
            timeText = itemView.findViewById(R.id.timeText);
        }
    }
}