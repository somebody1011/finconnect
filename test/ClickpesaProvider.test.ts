import { ClickpesaProvider } from "../src/providers/ClickpesaProvider";
import axios from "axios";

jest.mock("axios");

describe("ClickpesaProvider Authentication", () => {
  let clickpesaProvider: ClickpesaProvider;
  const mockConfig = {
    baseUrl: "https://api.clickpesa.com",
    CLICKPESA_CLIENT_ID: "test-client-id",
    CLICKPESA_API_KEY: "test-api-key",
  };

  beforeEach(() => {
    clickpesaProvider = new ClickpesaProvider(mockConfig);
  });

  it("should return a token on successful authentication", async () => {
    const mockToken = "mock-token";
    (axios.post as jest.Mock).mockResolvedValue({ data: { token: mockToken } });

    const token = await clickpesaProvider.authenticate();

    expect(token).toBe(mockToken);
    expect(axios.post).toHaveBeenCalledWith(
      `${mockConfig.baseUrl}/third-parties/generate-token`,
      {
        headers: {
          "client-id": mockConfig.CLICKPESA_CLIENT_ID,
          "api-key": mockConfig.CLICKPESA_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
  });

  it("should throw an error on authentication failure", async () => {
    const mockError = new Error("Authentication failed");
    (axios.post as jest.Mock).mockRejectedValue(mockError);

    await expect(clickpesaProvider.authenticate()).rejects.toThrow(
      "Authentication failed"
    );
  });
});