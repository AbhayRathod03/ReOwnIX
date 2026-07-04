package com.reownix.product.service.impl;


import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.reownix.product.service.CloudinaryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;
    


    @Override
    public String uploadFile(MultipartFile file)
            throws IOException {

        Map<?, ?> result =
                cloudinary.uploader().upload(
                        file.getBytes(),
                        ObjectUtils.emptyMap());

        return result.get("secure_url").toString();
    }

    @Override
    public void deleteFile(String imageUrl) {

        try {

            String publicId =
                    imageUrl.substring(
                            imageUrl.lastIndexOf("/") + 1,
                            imageUrl.lastIndexOf("."));

            cloudinary.uploader().destroy(
                    publicId,
                    ObjectUtils.emptyMap());

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to delete image");

        }
    }
}