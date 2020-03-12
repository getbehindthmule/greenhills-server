package greenhills.dto;

import lombok.Builder;
import lombok.Data;
import lombok.ToString;

import java.util.Map;

@Data
@Builder
@ToString
public class GatewayResponse {
    private  String body;
    private  Map<String, String> headers;
    private  int statusCode;
}
