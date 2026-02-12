package com.marketplace.dto.gemini;

import java.util.ArrayList;
import java.util.List;

public class GeminiRequest {
    private List<Content> contents;

    public GeminiRequest() {}

    public GeminiRequest(String prompt) {
        this.contents = new ArrayList<>();
        this.contents.add(new Content(prompt));
    }

    public List<Content> getContents() {
        return contents;
    }

    public void setContents(List<Content> contents) {
        this.contents = contents;
    }
}