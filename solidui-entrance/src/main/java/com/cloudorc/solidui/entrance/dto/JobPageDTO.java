package com.cloudorc.solidui.entrance.dto;

import java.util.List;

public class JobPageDTO {
    private Long id;

    private Long projectId;

    private String name;

    private Long parentId;
    /**
     * page layout information
     */
    private Integer layout;

    private String createTime;

    private String updateTime;

    private Integer order;

    private List<JobPageDTO> children;

    public JobPageDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Integer getLayout() {
        return layout;
    }

    public void setLayout(Integer layout) {
        this.layout = layout;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public String getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(String updateTime) {
        this.updateTime = updateTime;
    }

    public Integer getOrder() {
        return order;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public List<JobPageDTO> getChildren() {
        return children;
    }

    public void setChildren(List<JobPageDTO> children) {
        this.children = children;
    }
}
