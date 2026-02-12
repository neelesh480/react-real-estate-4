package com.marketplace.dto.gemini;

import java.util.ArrayList;
import java.util.List;

public class Content {
    private List<Part> parts;

    public Content() {}

    public Content(String text) {
        this.parts = new ArrayList<>();
        this.parts.add(new Part(text));
    }

    public List<Part> getParts() {
        return parts;
    }

    public void setParts(List<Part> parts) {
        this.parts = parts;
    }

    public void addPart(Part part) {
        if (this.parts == null) {
            this.parts = new ArrayList<>();
        }
        this.parts.add(part);
    }
}
