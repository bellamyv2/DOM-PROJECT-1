document.addEventListener("DOMContentLoaded", () => {
  const products = document.querySelector(".list-products");
  const totalElement = document.querySelector(".total");
  const currency = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  });

  function updateTotal() {
    const totalCents = [...products.querySelectorAll(".product-item")].reduce(
      (sum, item) => {
        const quantity = Number(item.querySelector(".quantity").textContent);
        const unitPrice = Number(
          item.querySelector(".unit-price").textContent.replace(/[^\d.-]/g, ""),
        );

        if (!Number.isFinite(quantity) || !Number.isFinite(unitPrice)) {
          throw new Error("Cart items must have valid quantities and prices.");
        }

        return sum + Math.round(unitPrice * 100) * quantity;
      },
      0,
    );

    totalElement.textContent = currency.format(totalCents / 100);
  }

  products.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button || !products.contains(button)) {
      return;
    }

    const item = button.closest(".product-item");
    if (!item) {
      return;
    }

    switch (button.dataset.action) {
      case "increase": {
        const quantityElement = item.querySelector(".quantity");
        quantityElement.textContent = String(Number(quantityElement.textContent) + 1);
        item.querySelector('[data-action="decrease"]').disabled = false;
        break;
      }
      case "decrease": {
        const quantityElement = item.querySelector(".quantity");
        const quantity = Math.max(0, Number(quantityElement.textContent) - 1);
        quantityElement.textContent = String(quantity);
        button.disabled = quantity === 0;
        break;
      }
      case "remove":
        item.remove();
        break;
      case "like": {
        const isLiked = button.getAttribute("aria-pressed") !== "true";
        button.setAttribute("aria-pressed", String(isLiked));
        button.classList.toggle("is-liked", isLiked);
        break;
      }
      default:
        return;
    }

    updateTotal();
  });

  updateTotal();
});
