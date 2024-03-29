package com.adsmanagement.surfaces;


import com.adsmanagement.common.Response;
import com.adsmanagement.config.UserInfoUserDetails;
import com.adsmanagement.reports.dto.ReportDto;
import com.adsmanagement.spaces.SpaceRepository;
import com.adsmanagement.spaces.dto.CreateSpaceRequestDto;
import com.adsmanagement.spaces.dto.SpaceRequestDto;
import com.adsmanagement.spaces.models.RequestState;
import com.adsmanagement.surfaces.dto.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "/api/v1/surfaces")
@Tag(name = "Quản lý bảng quảng cáo", description = "Dùng để Quản lý bảng quảng cáo")

public class SurfaceController {
    private final SurfaceService surfaceService;

    private final  SurfaceRepository surfaceRepository;

    private final SpaceRepository spaceRepository;

    private  final  SurfaceRequestRepository surfaceRequestRepository;

    @Autowired
    public SurfaceController(SurfaceService surfaceService,SurfaceRepository surfaceRepository,SpaceRepository spaceRepository,SurfaceRequestRepository surfaceRequestRepository) {
        this.surfaceService = surfaceService;
        this.surfaceRepository =surfaceRepository;
        this.spaceRepository = spaceRepository;
        this.surfaceRequestRepository = surfaceRequestRepository;
    }

    @Operation(summary = "Get a list of surfaces")
    @ApiResponse(responseCode = "200", description = "List of surfaces",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = Response.class)))
    @GetMapping(path = "")
    public ResponseEntity<Response<Page<SurfaceDto>>> list(
            @RequestParam(defaultValue = "0") Short page,
            @RequestParam(defaultValue = "20") Short size,
            @RequestParam(required = false) Short cityId,
            @RequestParam(required = false) List<Short> wardIds,
            @RequestParam(required = false) List<Short> districtIds,
            @RequestParam(required = false) List<Short> spaceIds

            )   {
        var data = this.surfaceService.findAll(page,size,cityId,wardIds, districtIds,spaceIds);

        var contents = new ArrayList<SurfaceDto>();
        for (int i = 0; i < data.getContent().size(); i++){
            contents.add(data.getContent().get(i).toDto());
        }

        Page<SurfaceDto> dataRes = new PageImpl<>(contents,data.getPageable(),data.getTotalElements());
        var res = new Response<>("",dataRes);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @Operation(summary = "Create a new surface")
    @ApiResponse(responseCode = "200", description = "Surface created successfully",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = Response.class)))
    @PostMapping(path = "")
    public ResponseEntity<Response<SurfaceDto>> create(
           @RequestBody CreateSurfaceDto createSurfaceDto
    )   {
        var data = this.surfaceService.create(createSurfaceDto);
        var res = new Response<>("",data.toDto());
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @Operation(summary = "Create a new surface request for a specific surface")
    @ApiResponse(responseCode = "200", description = "Surface request created successfully",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = Response.class)))
    @PostMapping(path = "/{id}/request")
    public ResponseEntity<Response<SurfaceRequestDto>> createRequest(
            @PathVariable("id") Short surfaceId,
            @RequestBody CreateSurfaceRequestDto createSurfaceRequestDto,
            @AuthenticationPrincipal UserInfoUserDetails userDetails
    )   {
        var surfaceO = this.surfaceRepository.findById(surfaceId);
        if (surfaceO == null || surfaceO.isEmpty()) {
            var res = new Response<SurfaceRequestDto>("Quảng cáo không tồn tại",null,HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(res, HttpStatus.OK);
        }

//        if (spaceReqO.get().getState() != RequestState.IN_PROGRESS) {
//            var res = new Response<SpaceRequestDto>("Không thể huỷ yêu cầu",null,HttpStatus.BAD_REQUEST);
//            return new ResponseEntity<>(res, HttpStatus.OK);
//        }

        if (createSurfaceRequestDto.getSpaceId() == null ) {
            var res = new Response<SurfaceRequestDto>("Điểm đặt quảng cáo không tồn tại",null,HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(res, HttpStatus.OK);
        }

        var spaceO = this.spaceRepository.findById(createSurfaceRequestDto.getSpaceId());
        if (spaceO == null || spaceO.isEmpty()) {
            var res = new Response<SurfaceRequestDto>("Điểm đặt quảng cáo không tồn tại",null,HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(res, HttpStatus.OK);
        }



        var user = userDetails.getUser();
        createSurfaceRequestDto.setUserId(user.getId());
        createSurfaceRequestDto.setSurfaceId(surfaceId);

        var data = this.surfaceService.createRequest(createSurfaceRequestDto, user);
        var res = new Response<>("",data.toDto());
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @Operation(summary = "Process a surface request by ID")
    @ApiResponse(responseCode = "200", description = "Surface request processed successfully",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = Response.class)))
    @PostMapping(path = "/request/{id}/process")
    public ResponseEntity<Response<SurfaceRequestDto>> processRequest(
            @PathVariable("id") Short reqId,
            @RequestBody ProcessResponse processResponse,
            @AuthenticationPrincipal UserInfoUserDetails userDetails
    )   {

        var reqO = this.surfaceRequestRepository.findById(reqId);
        if (reqO == null || reqO.isEmpty()) {
            var res = new Response<SurfaceRequestDto>("Yêu cầu không tồn tại",null,HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(res, HttpStatus.OK);
        }

        var user = userDetails.getUser();

        var data = this.surfaceService.processRequest(reqO.get(),processResponse, user);
        var res = new Response<>("",data.toDto());
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @Operation(summary = "Cancel a surface request by ID")
    @ApiResponse(responseCode = "200", description = "Surface request canceled successfully",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = Response.class)))
    @PostMapping(path = "/request/{id}/cancel")
    public ResponseEntity<Response<SurfaceRequestDto>> processRequest(
            @PathVariable("id") Short reqId,
            @AuthenticationPrincipal UserInfoUserDetails userDetails
    )   {

        var reqO = this.surfaceRequestRepository.findById(reqId);
        if (reqO == null || reqO.isEmpty()) {
            var res = new Response<SurfaceRequestDto>("Yêu cầu không tồn tại",null,HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(res, HttpStatus.OK);
        }

        if (reqO.get().getState() != RequestState.IN_PROGRESS) {
            var res = new Response<SurfaceRequestDto>("Không thể huỷ yêu cầu",null,HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(res, HttpStatus.OK);
        }

        var user = userDetails.getUser();

        var data = this.surfaceService.processRequest(reqO.get(),new ProcessResponse(RequestState.CANCELED, ""), user);
        var res = new Response<>("",data.toDto());
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @Operation(summary = "Get a list of surface requests")
    @ApiResponse(responseCode = "200", description = "List of surface requests",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = Response.class)))
    @GetMapping(path = "/request")
    public ResponseEntity<Response<Page<SurfaceRequestDto>>> listRequest(
            @RequestParam(defaultValue = "0") Short page,
            @RequestParam(defaultValue = "20") Short size,
            @RequestParam(required = false) Short cityId,
            @RequestParam(required = false) List<Short> wardIds,
            @RequestParam(required = false) List<Short> districtIds,
            @RequestParam(required = false) List<Short> surfaceIds,
            @RequestParam(required = false) RequestState state,
            @AuthenticationPrincipal UserInfoUserDetails userDetails
    )   {
        var user = userDetails.getUser();
        var data = this.surfaceService.findAllRequest(page, size,cityId, districtIds, wardIds, surfaceIds,state);

        var contents = new ArrayList<SurfaceRequestDto>();
        for (int i = 0; i < data.getContent().size(); i++){
            contents.add(data.getContent().get(i).toDto());
        }

        Page<SurfaceRequestDto> dataRes = new PageImpl<>(contents,data.getPageable(),data.getTotalElements());
        var res = new Response<>("",dataRes);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @Operation(summary = "Get details of a surface by ID")
    @ApiResponse(responseCode = "200", description = "Surface details",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = Response.class)))
    @GetMapping(path = "/{id}")
    public ResponseEntity<Response<SurfaceDto>> detail(
            @PathVariable("id") Short id
    )   {
        var data = this.surfaceService.findById(id);

        if (data.isEmpty() || data.get() == null) {
            var res = new Response<SurfaceDto>("Điểm đặt báo cáo không tồn tại",null,HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(res, HttpStatus.OK);
        }

        var res = new Response<SurfaceDto>("",data.get().toDto(),HttpStatus.OK);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @Operation(summary = "Update a surface by ID")
    @ApiResponse(responseCode = "200", description = "Surface updated successfully",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = Response.class)))
    @PostMapping(path = "/{id}")
    public ResponseEntity<Response<SurfaceDto>> update(
            @PathVariable("id") Short id,
            @RequestBody UpdateSurfaceDto dto
    )   {
        var data = this.surfaceService.findById(id);

        if (data.isEmpty() || data.get() == null) {
            var res = new Response<SurfaceDto>("Điểm đặt báo cáo không tồn tại",null,HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(res, HttpStatus.OK);
        }

        var resData = this.surfaceService.update(id,dto);

        var res = new Response<>("",resData.toDto(),HttpStatus.OK);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @Operation(summary = "Delete a surface by ID")
    @ApiResponse(responseCode = "200", description = "Surface deleted successfully",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = Response.class)))
    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Response<String>> delete(
            @PathVariable("id") Short id
    )   {
        var data = this.surfaceService.findById(id);

        if (data.isEmpty() || data.get() == null) {
            var res = new Response<String>("Điểm đặt báo cáo không tồn tại",null,HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(res, HttpStatus.OK);
        }

        this.surfaceService.delete(id);

        var res = new Response<>("","ok",HttpStatus.OK);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}
