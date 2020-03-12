package greenhills;

import greenhills.dto.GatewayResponse;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.Collections;

import static org.assertj.core.api.Assertions.*;

public class GetContactDetailsHandlerTest {

    GetContactDetailsHandler getContactDetailsHandler;

    @Before
    public void setUp() throws Exception {
        getContactDetailsHandler = new GetContactDetailsHandler();
    }

    @After
    public void tearDown() throws Exception {
    }

    @Test
    public void handleRequest() {
        // arrange
        String expectedBody = "{\"phoneNumber\":\"PHONE\",\"emailAddress\":\"contact@greenhillsconsultancy.co.uk\"}";

        // act
        final GatewayResponse gatewayResponse = getContactDetailsHandler.handleRequest(null, null);

        // assert;
        assertThat(gatewayResponse).extracting("statusCode", "headers", "body")
                .contains(200, Collections.EMPTY_MAP, expectedBody);
    }
}