package com.example.pdfconverter;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private FileConversionService conversionService;

    @PostMapping("/convert")
    public ResponseEntity<byte[]> convertWordToPdf(@RequestParam("file") MultipartFile file) {
        try {
            byte[] pdfData = conversionService.convertWordToPdf(file.getBytes());

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=converted.pdf");
            return new ResponseEntity<>(pdfData, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
