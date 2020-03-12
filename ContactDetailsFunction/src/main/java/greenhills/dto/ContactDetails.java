package greenhills.dto;


import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@Builder
@ToString
public class ContactDetails {
    private String phoneNumber;
    private String emailAddress;
}
