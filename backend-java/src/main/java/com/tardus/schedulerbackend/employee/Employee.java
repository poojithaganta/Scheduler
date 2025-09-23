package com.tardus.schedulerbackend.employee;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "employees")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String phone;

    @NotBlank
    @Column(columnDefinition = "text")
    private String address;

    @NotBlank
    @Column(name = "office_location")
    private String officeLocation;

    @Column(name = "resume_file")
    private String resumeFile;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getOfficeLocation() { return officeLocation; }
    public void setOfficeLocation(String officeLocation) { this.officeLocation = officeLocation; }
    public String getResumeFile() { return resumeFile; }
    public void setResumeFile(String resumeFile) { this.resumeFile = resumeFile; }
}


