package com.example.pdfconverter;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class FileConversionService {

    public byte[] convertWordToPdf(byte[] wordData) throws IOException {
        try (XWPFDocument document = new XWPFDocument(new ByteArrayInputStream(wordData));
             ByteArrayOutputStream pdfOutputStream = new ByteArrayOutputStream()) {
            
            PdfWriter writer = new PdfWriter(pdfOutputStream);
            PdfDocument pdfDocument = new PdfDocument(writer);
            Document pdfDoc = new Document(pdfDocument);

            // Convert Word paragraphs to PDF
            document.getParagraphs().forEach(paragraph -> {
                String text = paragraph.getText();
                pdfDoc.add(new Paragraph(text));
            });

            pdfDoc.close();
            return pdfOutputStream.toByteArray();
        }
    }
}
