package greenhills;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import greenhills.dto.ContactDetails;
import greenhills.dto.GatewayResponse;

import java.util.HashMap;
import com.google.gson.Gson;

public class GetContactDetailsHandler implements RequestHandler<Object, GatewayResponse> {

    private static final Gson GSON = new Gson();
    private final static String EMAIL = "contact@greenhillsconsultancy.co.uk";
    private final static String PHONE = "074";


    @Override
    public GatewayResponse handleRequest(Object input, Context context) {
        ContactDetails contactDetails = ContactDetails.builder()
                .emailAddress(EMAIL)
                .phoneNumber(PHONE)
                .build();

        return GatewayResponse.builder()
                .headers(new HashMap<String, String>())
                .statusCode(200)
                .body(GSON.toJson(contactDetails))
                .build();

    }
}
