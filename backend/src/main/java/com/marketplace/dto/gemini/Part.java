package com.marketplace.dto.gemini;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Part {
    private String text;

    @JsonProperty("inline_data")
    private InlineData inlineData;

    public Part() {}

    public Part(String text) {
        this.text = text;
    }

    public Part(InlineData inlineData) {
        this.inlineData = inlineData;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public InlineData getInlineData() {
        return inlineData;
    }

    public void setInlineData(InlineData inlineData) {
        this.inlineData = inlineData;
    }
}
