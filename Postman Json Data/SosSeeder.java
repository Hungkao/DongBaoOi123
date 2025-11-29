import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;

public class SosSeeder {

    private static final String REGISTER_URL = "http://localhost:8080/auth/register";
    private static final String SOS_URL = "http://localhost:8080/sos";

    public static void main(String[] args) throws Exception {
        // Load the JSON file containing all SOS requests
        String jsonArray = Files.readString(Paths.get("sos_data.json")).trim();

        // Remove [ ] from the JSON array
        if (jsonArray.startsWith("[")) jsonArray = jsonArray.substring(1);
        if (jsonArray.endsWith("]")) jsonArray = jsonArray.substring(0, jsonArray.length() - 1);

        // Split each SOS object (simple split, assumes no nested objects with "},")
        String[] sosRequests = jsonArray.split("\\},\\s*\\{");

        int userIndex = 1;

        for (String sos : sosRequests) {
            // Fix JSON object brackets
            if (!sos.startsWith("{")) sos = "{" + sos;
            if (!sos.endsWith("}")) sos = sos + "}";

            // 1️⃣ Register a new user with unique fullname and email
            String fullname = "User" + userIndex;
            String email = "user" + userIndex + "@gmail.com";
            String password = "123";

            String registerJson = String.format(
                    "{\"fullname\":\"%s\",\"username\":\"%s\",\"email\":\"%s\",\"password\":\"%s\"}",
                    fullname, fullname, email, password
            );

            String registerResponse = sendPost(REGISTER_URL, registerJson, null);
            if (registerResponse == null || !registerResponse.contains("accessToken")) {
                System.out.println("❌ Failed to register " + fullname);
                continue;
            }

            // Extract JWT token from response
            String token = extractToken(registerResponse);
            System.out.println("✅ Registered " + fullname + " got token: " + token);

            // 2️⃣ Send SOS request
            String sosResponse = sendPost(SOS_URL, sos, token);
            System.out.println("📩 SOS response: " + sosResponse);

            userIndex++;
        }

        System.out.println("✅ All requests processed.");
    }

    private static String sendPost(String urlStr, String jsonBody, String token) {
        try {
            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            if (token != null) conn.setRequestProperty("Authorization", "Bearer " + token);
            conn.setDoOutput(true);

            try (OutputStream os = conn.getOutputStream()) {
                os.write(jsonBody.getBytes());
            }

            return new String(conn.getInputStream().readAllBytes());
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    // Very simple token extraction (for testing only)
    private static String extractToken(String response) {
        int idx = response.indexOf("accessToken");
        if (idx == -1) return null;
        int start = response.indexOf(":", idx) + 2; // skip colon and opening quote
        int end = response.indexOf("\"", start);
        return response.substring(start, end);
    }
}
