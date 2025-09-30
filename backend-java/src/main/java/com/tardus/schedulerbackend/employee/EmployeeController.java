package com.tardus.schedulerbackend.employee;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@Validated
public class EmployeeController {

    private final EmployeeRepository repository;

    public EmployeeController(EmployeeRepository repository) {
        this.repository = repository;
    }

    @PostMapping(consumes = {"multipart/form-data", "application/x-www-form-urlencoded"})
    public ResponseEntity<?> createEmployee(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String phone,
            @RequestParam String address,
            @RequestParam String officeLocation,
            @RequestParam(value = "resume", required = false) MultipartFile resume
    ) throws IOException {
        if (StringUtils.hasText(name) && StringUtils.hasText(email) && StringUtils.hasText(phone)
                && StringUtils.hasText(address) && StringUtils.hasText(officeLocation)) {

            Employee employee = new Employee();
            employee.setName(name);
            employee.setEmail(email);
            employee.setPhone(phone);
            employee.setAddress(address);
            employee.setOfficeLocation(officeLocation);
            if (resume != null && !resume.isEmpty()) {
                employee.setResumeData(resume.getBytes());
                employee.setResumeContentType(resume.getContentType());
                String original = resume.getOriginalFilename() == null ? "file" : resume.getOriginalFilename();
                employee.setResumeFilename(original);
            }
            // resume fields set above if present

            Employee saved = repository.save(employee);

            return ResponseEntity.status(201).body(Map.of(
                    "success", true,
                    "id", saved.getId(),
                    "officeLocation", saved.getOfficeLocation()
            ));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
    }

    @GetMapping("/{id}/resume")
    public ResponseEntity<byte[]> downloadResume(@PathVariable Long id) {
        return repository.findById(id)
                .filter(e -> e.getResumeData() != null)
                .map(e -> ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(e.getResumeContentType() != null ? e.getResumeContentType() : "application/octet-stream"))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + (e.getResumeFilename() != null ? e.getResumeFilename() : "resume") + "\"")
                        .body(e.getResumeData()))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}


