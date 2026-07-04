package com.reownix.product.service;


import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {

    String uploadFile(MultipartFile file) throws IOException;

    void deleteFile(String imageUrl);

}
