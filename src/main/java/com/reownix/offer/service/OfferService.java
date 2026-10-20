package com.reownix.offer.service;

import java.util.List;
import com.reownix.offer.request.MakeOfferRequest;
import com.reownix.offer.response.OfferResponse;
import com.reownix.offer.enums.OfferStatus;

public interface OfferService {
    OfferResponse makeOffer(String email, MakeOfferRequest request);
    List<OfferResponse> getProductOffers(Long productId, String email);
    List<OfferResponse> getMyOffers(String email);
    OfferResponse updateOfferStatus(Long offerId, OfferStatus status, String email);
}
