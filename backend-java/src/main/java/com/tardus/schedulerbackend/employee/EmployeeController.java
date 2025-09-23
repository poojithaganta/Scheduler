package com.tardus.schedulerbackend.employee;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@Validated
public class EmployeeController {

    private final EmployeeRepository repository;

    public EmployeeController(EmployeeRepository repository) {
        this.repository = repository;
    }

    @Value("${app.upload-dir:uploads}")
    private String uploadDir;

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

            String storedFileName = null;
            if (resume != null && !resume.isEmpty()) {
                Path dir = Paths.get(uploadDir);
                if (!Files.exists(dir)) {
                    Files.createDirectories(dir);
                }
                String original = resume.getOriginalFilename() == null ? "file" : resume.getOriginalFilename();
                String safeOriginal = original.replaceAll("\\s+", "_");
                String unique = Instant.now().toEpochMilli() + "-" + Math.abs(safeOriginal.hashCode());
                storedFileName = unique + "-" + safeOriginal;
                Files.copy(resume.getInputStream(), dir.resolve(storedFileName));
            }

            Employee employee = new Employee();
            employee.setName(name);
            employee.setEmail(email);
            employee.setPhone(phone);
            employee.setAddress(address);
            employee.setOfficeLocation(officeLocation);
            employee.setResumeFile(storedFileName);

            Employee saved = repository.save(employee);

            return ResponseEntity.status(201).body(Map.of(
                    "success", true,
                    "id", saved.getId(),
                    "officeLocation", saved.getOfficeLocation()
            ));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
    }

    @GetMapping("/resume/{filename}")
    public ResponseEntity<Resource> downloadResume(@PathVariable String filename) {
        try {
            Path file = Paths.get(uploadDir).resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                String contentType = Files.probeContentType(file);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }
                
                return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}


