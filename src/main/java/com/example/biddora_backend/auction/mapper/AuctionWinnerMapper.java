package com.example.biddora_backend.auction.mapper;

import com.example.biddora_backend.auction.dto.AuctionWinnerDto;
import com.example.biddora_backend.auction.entity.AuctionWinner;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AuctionWinnerMapper {
    @Mapping(source = "product", target = "productDto")
    AuctionWinnerDto mapToDto(AuctionWinner auctionWinner);
}
