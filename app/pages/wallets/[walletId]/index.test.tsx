import { render, screen } from "test/utils";
import ShowWalletPage from ".";
import faker from "faker";

const mockWalletId = faker.datatype.uuid();

const renderPage = () =>
  render(<ShowWalletPage />, { router: { params: { walletId: mockWalletId } } });

describe("show wallet page", () => {
  it("should render total", () => {
    renderPage();
    screen.logTestingPlaygroundURL();
  });

  it.todo("should render currency form");
  it.todo("should render amount list");
  it.todo("should refresh amount and total when deposit new currency");
  it.todo("should render error messages if no currency was selected or amount is less than 1");
});
