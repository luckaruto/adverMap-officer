package com.adsmanagement.spaces;


import com.adsmanagement.common.Response;
import com.adsmanagement.config.UserInfoUserDetails;
import com.adsmanagement.reports.dto.ReportDto;
import com.adsmanagement.spaces.dto.*;
import com.adsmanagement.spaces.models.RequestState;
import com.adsmanagement.surfaces.SurfaceRepository;
import com.adsmanagement.surfaces.dto.SurfaceDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "/api/v1/spaces")
public class SpaceController {
    private final SpaceService spaceService;

    private final SurfaceRepository surfaceRepository;

    private final SpaceRepository spaceRepository;
    private final SpaceRequestRepository spaceRequestRepository;


    @Autowired
    public SpaceController(SpaceService spaceService, SurfaceRepository surfaceRepository, SpaceRepository spaceRepository,SpaceRequestRepository spaceRequestRepository) {
        this.spaceService = spaceService;
        this.spaceRepository = spaceRepository;
        this.surfaceRepository = surfaceRepository;
        this.spaceRequestRepository = spaceRequestRepository;
    }

    @GetMapping(path = "")
    public ResponseEntity<Response<Page<SpaceDto>>> list(
            @RequestParam(defaultValue = "0") Short page,
            @RequestParam(defaultValue = "20") Short size,
            @RequestParam(required = false) Short cityId,
            @RequestParam(required = false) List<Short> wardIds,
            @RequestParam(required = false) List<Short> districtIds
            )   {
        var data = this.spaceService.findAll(page,size,cityId,wardIds, districtIds);

        var contents = new ArrayList<SpaceDto>();
        for (int i = 0; i < data.getContent().size(); i++){
            var dto = data.getContent().get(i).toDto();
            var count = this.surfaceRepository.countBySpaceId(dto.getId());
            dto.setTotalSurface(count);
            contents.add(dto);
        }

        Page<SpaceDto> dataRes = new PageImpl<>(contents,data.getPageable(),data.getTotalElements());
        var res = new Response<>("",dataRes);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PostMapping(path = "")
    public ResponseEntity<Response<SpaceDto>> create(
           @RequestBody CreateSpaceDto createSpaceDto
    )   {
        var data = this.spaceService.create(createSpaceDto);
        var res = new Response<>("",data.toDto());
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Response<String>> delete(
            @PathVariable("id") Short spaceId
    )   {
        var spaceO = this.spaceRepository.findById(spaceId);
        if (spaceO == null || spaceO.isEmpty()) {
            var res = new Response<String>("Điểm đặt báo cáo không tồn tại",null,HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(res, HttpStatus.OK);
        }

        this.spaceRepository.delete(spaceO.get());
        var res = new Response<>("","ok");
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PostMapping(path = "/{id}")
    public ResponseEntity<Response<SpaceDto>> update(
            @PathVariable("id") Short spaceId,
            @RequestBody UpdateSpaceDto updateSpaceDto,
            @AuthenticationPrincipal UserInfoUserDetails userDetails
    )   {
        var spaceO = this.spaceRepository.findById(spaceId);
        if (spaceO == null || spaceO.isEmpty()) {
            var res = new Response<SpaceDto>("Điểm đặt báo cáo không tồn tại",null,HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(res, HttpStatus.OK);
        }

        var space = spaceO.get();
        updateSpaceDto.setSpaceId(spaceId);

        space.setFieldByUpdateDto(updateSpaceDto);
        var sp = this.spaceRepository.save(space);
        var res = new Response<>("",sp.toDto());
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PostMapping(path = "/{id}/request")
    public ResponseEntity<Response<SpaceRequestDto>> createRequest(
            @PathVariable("id") Short spaceId,
            @RequestBody CreateSpaceRequestDto createSpaceRequestDto,
            @AuthenticationPrincipal UserInfoUserDetails userDetails
    )   {
        createSpaceRequestDto.setSpaceId(spaceId);
        var user = userDetails.getUser();
        var data = this.spaceService.createRequest(createSpaceRequestDto, user);
        var res = new Response<>("",data.toDto());
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PostMapping(path = "/request/{id}/process")
    public ResponseEntity<Response<SpaceRequestDto>> processRequest(
            @PathVariable("id") Short reqId,
            @RequestBody ProcessResponseDto processResponseDto,
            @AuthenticationPrincipal UserInfoUserDetails userDetails
    )   {
        var spaceReqO = this.spaceRequestRepository.findById(reqId);
        if (spaceReqO == null || spaceReqO.isEmpty()) {
            var res = new Response<SpaceRequestDto>("Điểm đặt báo cáo không tồn tại",null,HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(res, HttpStatus.OK);
        }

        var user = userDetails.getUser();
        var data = this.spaceService.processRequest(spaceReqO.get(),processResponseDto, user);
        var res = new Response<>("",data.toDto());
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PostMapping(path = "/request/{id}/cancel")
    public ResponseEntity<Response<SpaceRequestDto>> cancelRequest(
            @PathVariable("id") Short reqId,
            @AuthenticationPrincipal UserInfoUserDetails userDetails
    )   {
        var spaceReqO = this.spaceRequestRepository.findById(reqId);
        if (spaceReqO == null || spaceReqO.isEmpty()) {
            var res = new Response<SpaceRequestDto>("Điểm đặt báo cáo không tồn tại",null,HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(res, HttpStatus.OK);
        }
        if (spaceReqO.get().getState() != RequestState.IN_PROGRESS) {
            var res = new Response<SpaceRequestDto>("Không thể huỷ yêu cầu",null,HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(res, HttpStatus.OK);
        }

        var user = userDetails.getUser();
        var data = this.spaceService.processRequest(spaceReqO.get(),new ProcessResponseDto(RequestState.CANCELED, ""), user);
        var res = new Response<>("",data.toDto());
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping(path = "/request")
    public ResponseEntity<Response<Page<SpaceRequestDto>>> listRequest(
            @RequestParam(defaultValue = "0") Short page,
            @RequestParam(defaultValue = "20") Short size,
            @RequestParam(required = false) Short spaceId,
            @RequestParam(required = false) Short cityId,
            @RequestParam(required = false) List<Short> wardIds,
            @RequestParam(required = false) List<Short> districtIds,
            @AuthenticationPrincipal UserInfoUserDetails userDetails
    )   {
        var user = userDetails.getUser();
        var data = this.spaceService.findAllRequest(page, size, spaceId,cityId, wardIds, districtIds);

        var contents = new ArrayList<SpaceRequestDto>();
        for (int i = 0; i < data.getContent().size(); i++){
            contents.add(data.getContent().get(i).toDto());
        }

        Page<SpaceRequestDto> dataRes = new PageImpl<>(contents,data.getPageable(),data.getTotalElements());
        var res = new Response<>("",dataRes);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<Response<SpaceDto>> detail(
            @PathVariable("id") Short id
    )   {
        var data = this.spaceService.findById(id);

        if (data.isEmpty() || data.get() == null) {
            var res = new Response<SpaceDto>("Quảng cáo không tồn tại",null,HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(res, HttpStatus.OK);
        }

        var dto = data.get().toDto() ;
        var count = this.surfaceRepository.countBySpaceId(dto.getId());
        dto.setTotalSurface(count);

        var res = new Response<>("", dto,HttpStatus.OK);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

}
