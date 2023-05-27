package com.cloudorc.solidui.entrance.vo;

import com.fasterxml.jackson.core.JsonToken;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
public class JobElementPageVO {
    private Long projectId;
    private Page page;
    private Size size;
    private List<View> views;

    //JobElementPage name id
    @Data
    @Builder
    public static class Page {
        private String name;
        private Long id;


        // Getters and setters
    }
    //JobElementPage position
    @Data
    public static class Size {
        private double width;
        private double height;

    }
    //JobElementPage views
    @Data
    public static class View {
        private Long id;
        private String title;
        private Position position;
        private Size size;
        private String type;
        private String options;
        private Data data;

        // Getters and setters
        @lombok.Data
        public static class Position {
            private double top;
            private double left;

            // Getters and setters
        }
        @lombok.Data
        public static class Data {
            private Long dataSourceId;
            private Long dataSourceTypeId;
            private String sql;

        }


    }
}
