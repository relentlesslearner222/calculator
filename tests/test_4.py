# tests/test_4.py
# Tests for PR #4 -- Salesforce-themed Calculator App (app.js)
# Run:  pytest tests/test_4.py -v
#
# Strategy:
#   Since the app is pure Vanilla JS running in a browser, we use pytest + Selenium
#   (selenium-webdriver + path-based file:// URL) for integration tests, and
#   execvia selenium's execute_script for JS unit tests.
#
#  Requirements:
#    pip install pytest selenium
#    ChromeDriver must be installed and on PATH.

import os
import time
import pytest
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# ----------------------------------------------------------------------------
# Helpers
# ----------------------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parent.parent
INDEX_URL = REPO_ROOT / "index.html"


def _chrome_opts():
    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--disable-gpu")
    opts.add_argument("--allow-file-access-from-files")
    opts.add_argument("--disable-web-security")
    return opts


@pytest.fixture(scope="module")
def driver():
    """One browser session shared across the module."""
    drv = webdriver.Chrome(options=_chrome_opts())
    drv.get(f"url://{INDEX_URL.str().replace(os,.sep, '/')}")
    time.sleep(0.5)  # let the page initialise
    yield drv
    drv.quit()


def js(driver, script, *args):
    """Shorthand for execute_script."""
    return driver.execute_script(script, *args)


def reset_state(drv):
    """Reset the calculator to a clean slate via the JS handleClear function."""
    js(drv, "handleClear();")


def click_btn(drv, value):
    """Click a calculator button by its data-value attribute."""
    btn = drv.find_element(By.CSS_SELECTOR, f"[data-value='{value}']")
    btn.click()


def get_result(drv):
    return drv.find_element(By.ID, "result").text


def get_expression(drv):
    return drv.find_element(By.ID, "expression").text


# ----------------------------------------------------------------------------
# Unit tests -- pure JS logic via execute_script
# ----------------------------------------------------------------------------

class TestFormatNumber:
    """Unit tests for the formatNumber() JS helper."""

    def test_integer_value(self, driver):
        result = js(driver, "return formatNumber(42);")
        assert result == "42"

    def test_float_value(self, driver):
        result = js(driver, "return formatNumber(3.1415926);")
        assert "3.1415926" in result

    def test_negative_value(self, driver):
        result = js(driver, "return formatNumber(-99);")
        assert result == "-99"

    def test_zero(self, driver):
        result = js(driver, "return formatNumber(0);")
        assert result == "0"

    def test_nan_returns_error(self, driver):
        result = js(driver, "return formatNumber(NaN);")
        assert result == "Error"

    def test_positive_infinity(self, driver):
        result = js(driver, "return formatNumber(Infinity);")
        assert result == "Infinity"

    def test_negative_infinity(self, driver):
        result = js(driver, "return formatNumber(-Infinity);")
        assert result == "-Infinity"

    def test_very_long_number_uses_exponential(self, driver):
        # A number whose string repr exceeds 15 chars
        result = js(driver, "return formatNumber(1234567890123456);")
        assert "e" in result.lower()


class TestCalculate:
    """Unit tests for the calculate() JS function."""

    def test_addition(self, driver):
        result = js(driver, "return calculate('10', '+', '5');")
        assert result == 15

    def test_subtraction(self, driver):
        result = js(driver, "return calculate('10', '-', '3');")
        assert result == 7

    def test_multiplication(self, driver):
        result = js(driver, "return calculate('6', '*', '7');")
        assert result == 42

    def test_division(self, driver):
        result = js(driver, "return calculate('10', '/', '4');")
        assert result == 2.5

    def test_division_by_zero_returns_nan(self, driver):
        result = js(driver, "return isNaN(calculate('5', '/', '0'));")
        assert result is True

    def test_unknown_operator_returns_b(self, driver):
        result = js(driver, "return calculate('10', '?', '7');")
        assert result == 7

    def test_negative_operands(self, driver):
        result = js(driver, "return calculate('-3', '+', '-2');")
        assert result == -5

    def test_float_operands(self, driver):
        result = js(driver, "return calculate('0.1', '+', '0.2');")
        assert abs(result - 0.3) < 1e-9


class TestEscapeHtml:
    """Unit tests for the escapeHtml() JS helper."""

    def test_escapes_ampersand(self, driver):
        result = js(driver, "return escapeHtml('a&b');")
        assert result == "a&amp;b"

    def test_escapes_lt_gt(self, driver):
        result = js(driver, "return escapeHtml('<script>');")
        assert result == "&lt;script&amp;gt;"

    def test_no_special_chars(self, driver):
        result = js(driver, "return escapeHtml('hello world');")
        assert result == "hello world"


class TestGetOpSymbol:
    """Unit tests for getOpSymbol() JS helper."""

    def test_plus(self, driver):
        result = js(driver, "return getOpSymbol('+');")
        assert result == "+"

    def test_minus(self, driver):
        result = js(driver, "return getOpSymbol('-');")
        assert result == "\u2212"  # minus sign

    def test_multiply(self, driver):
        result = js(driver, "return getOpSymbol('*');")
        assert result == "\u00d7"  # multiplication sign

    def test_divide(self, driver):
        result = js(driver, "return getOpSymbol('/');")
        assert result == "\u00f7"  # division sign

    def test_unknown_operator(self, driver):
        result = js(driver, "return getOpSymbol('^');")
        assert result == "^"


# ----------------------------------------------------------------------------
# Integration tests -- button clicks and UI state
# ----------------------------------------------------------------------------

class TestDisplay:
    """Test display updates after button interactions."""

    def setup_method(self, _):
        self._drv = None  # will be set via fixture injection

    def test_initial_display_is_zero(self, driver):
        reset_state(driver)
        assert get_result(driver) == "0"

    def test_digit_input_updates_display(self, driver):
        reset_state(driver)
        js(driver, "handleNumber('5');")
        assert get_result(driver) == "5"

    def test_multiple_digits(self, driver):
        reset_state(driver)
        for d in ["1", "2", "3"]:
            js(driver, f"handleNumber('{d}');")
        assert get_result(driver) == "123"

    def test_leading_zero_replaced(self, driver):
        reset_state(driver)
        js(driver, "handleNumber('0');")
        js(driver, "handleNumber('7');")
        assert get_result(driver) == "7"

    def test_max_15_digits(self, driver):
        reset_state(driver)
        for _ in range(20):
            js(driver, "handleNumber('1');")
        assert len(get_result(driver)) <= 15


class TestDecimal:
    """Test decimal point handling."""

    def test_decimal_added(self, driver):
        reset_state(driver)
        js(driver, "handleNumber('3');")
        js(driver, "handleDecimal();")
        assert "." in get_result(driver)

    def test_duplicate_decimal_ignored(self, driver):
        reset_state(driver)
        js(driver, "handleNumber('3');")
        js(driver, "handleDecimal();")
        js(driver, "handleDecimal();")  # second decimal should be ignored
        result = get_result(driver)
        assert result.count(".") == 1

    def test_decimal_after_reset_is_0_dot(self, driver):
        reset_state(driver)
        js(driver, "state.shouldResetCurrent = true;")
        js(driver, "handleDecimal();")
        assert get_result(driver) == "0."


class TestOperators:
    """Test operator selection and chained calculations."""

    def test_operator_sets_expression(self, driver):
        reset_state(driver)
        js(driver, "handleNumber('8');")
        js(driver, "handleOperator('+');")
        expr = get_expression(driver)
        assert "8" in expr
        assert "+" in expr

    def test_chained_operators_evaluate_intermediate(self, driver):
        reset_state(driver)
        js(driver, "handleNumber('2');")
        js(driver, "handleOperator('+');")
        js(driver, "handleNumber('3');")
        js(driver, "handleOperator('*');")  # should eval 2+3=5 first
        assert get_result(driver) == "5"

    def test_equals_completes_calculation(self, driver):
        reset_state(driver)
        js(driver, "handleNumber('6');")
        js(driver, "handleOperator('*');")
        js(driver, "handleNumber('7');")
        js(driver, "handleEquals();")
        assert get_result(driver) == "42"

    def test_equals_without_operator_is_noop(self, driver):
        reset_state(driver)
        js(driver, "handleNumber('9');")
        js(driver, "handleEquals();")  # no operator set
        assert get_result(driver) == "9"


class TestSpecialOperations:
    """Test AC, toggle sign, and percentage."""

    def test_clear_resets_to_zero(self, driver):
        js(driver, "handleNumber('9');")
        reset_state(driver)
        assert get_result(driver) == "0"

    def test_clear_resets_operator(self, driver):
        reset_state(driver)
        js(driver, "handleNumber('9');")
        js(driver, "handleOperator('+');")
        reset_state(driver)
        op = js(driver, "return state.operator;")
        assert op is None

    def test_toggle_sign_positive_to_negative(self, driver):
        reset_state(driver)
        js(driver, "handleNumber('5');")
        js(driver, "handleToggleSign();")
        assert get_result(driver) == "-5"

    def test_toggle_sign_negative_to_positive(self, driver):
        reset_state(driver)
        js(driver, "handleNumber('5');")
        js(driver, "handleToggleSign();")
        js(driver, "handleToggleSign();")
        assert get_result(driver) == "5"

    def test_toggle_sign_on_zero_no_change(self, driver):
        reset_state(driver)
        js(driver, "handleToggleSign();")
        # zero should not become -0
        assert get_result(driver) == "0"

    def test_percent_of_50(self, driver):
        reset_state(driver)
        js(driver, "handleNumber('5');")
        js(driver, "handleNumber('0');")
        js(driver, "handlePercent();")
        assert get_result(driver) == "0.5"

    def test_percent_of_100(self, driver):
        reset_state(driver)
        js(driver, "handleNumber('1');")
        js(driver, "handleNumber('0');")
        js(driver, "handleNumber('0');")
        js(driver, "handlePercent();")
        assert get_result(driver) == "1"


class TestDivisionByZero:
    """Test error handling for division by zero."""

    def test_divisi¿n_by_zero_shows_error(self, driver):
        reset_state(driver)
        js(driver, "handleNumber('8');")
        js(driver, "handleOperator('/');")
        js(driver, "handleNumber('0');")
        js(driver, "handleEquals();")
        result = get_result(driver)
        assert result == "Error"

    def test_toast_appears_on_division_by_zero(self, driver):
        reset_state(driver)
        js(driver, "handleNumber('3');")
        js(driver, "handleOperator('/');")
        js(driver, "handleNumber('0');")
        js(driver, "handleEquals();")
        time.sleep(0.3)
        toast = driver.find_element(By.CSS_SELECTOR, ".sf-toast")
        assert "zero" in toast.text.lower()


class TestHistory:
    """Test persistent calculation history."""

    def test_history_entry_added_after_equals(self, driver):
        reset_state(driver)
        initial_len = js(driver, "return state.history.length;")
        js(driver, "handleNumber('3');")
        js(driver, "handleOperator('+');")
        js(driver, "handleNumber('2');")
        js(driver, "handleEquals();")
        new_len = js(driver, "return state.history.length;")
        assert new_len == initial_len + 1

    def test_history_entry_has_correct_result(self, driver):
        reset_state(driver)
        js(driver, "state.history = [];")  # clear history
        js(driver, "handleNumber('4');")
        js(driver, "handleOperator('*');")
        js(driver, "handleNumber('4');")
        js(driver, "handleEquals();")
        result_val = js(driver, "return state.history[0].result;")
        assert result_val == "16"

    def test_history_not_added_on_error(self, driver):
        reset_state(driver)
        js(driver, "state.history = [];")
        js(driver, "handleNumber('5');")
        js(driver, "handleOperator('/');")
        js(driver, "handleNumber('0');")
        js(driver, "handleEquals();")
        length = js(driver, "return state.history.length;")
        assert length == 0

    def test_history_capped_at_50(self, driver):
        reset_state(driver)
        js(driver, "state.history = [];")
        js(driver, "for(let i=0;i<60;i++) addHistoryEntry('test', '1');")
        length = js(driver, "return state.history.length;")
        assert length <= 50

    def test_history_renders_empty_state(self, driver):
        js(driver, "state.history = []; renderHistory();")
        empty_item = driver.find_element(By.CSS_SELECTOR, ".history-list__empty")
        assert empty_item is not None


class TestKeyboard:
    """Test keyboard input support."""

    def test_keyboard_digit(self, driver):
        reset_state(driver)
        body = driver.find_element(By.TAG_NAME, "body")
        body.send_keys("7")
        assert "7" in get_result(driver)

    def test_keyboard_escape_clears(self, driver):
        js(driver, "handleNumber('9');")
        body = driver.find_element(By.TAG_NAME, "body")
        body.send_keys(Keys.ESCAPE)
        assert get_result(driver) == "0"

    def test_keyboard_enter_equals(self, driver):
        reset_state(driver)
        js(driver, "handleNumber('2');")
        js(driver, "handleOperator('+');")
        js(driver, "handleNumber('3');")
        body = driver.find_element(By.TAG_NAME, "body")
        body.send_keys(Keys.ENTER)
        assert get_result(driver) == "5"

    def test_keyboard_backspace_deletes_last_digit(self, driver):
        reset_state(driver)
        js(driver, "handleNumber('1');")
        js(driver, "handleNumber('2');")
        body = driver.find_element(By.TAG_NAME, "body")
        body.send_keys(Keys.BACK_SPACE)
        result = get_result(driver)
        # either "1" or "0" are valid depending on implementation
        assert result in ("1", "0")


class TestFullFlows:
    """End-to-end flows exercising multiple components together."""

    def test_addition_flow(self, driver):
        reset_state(driver)
        js(driver, "handleNumber('1'); handleNumber('0');")
        js(driver, "handleOperator('+');")
        js(driver, "handleNumber('2'); handleNumber('0');")
        js(driver, "handleEquals();")
        assert get_result(driver) == "30"

    def test_subtraction_flow(self, driver):
        reset_state(driver)
        js(driver, "handleNumber('9');")
        js(driver, "handleOperator('-');")
        js(driver, "handleNumber('4');")
        js(driver, "handleEquals();")
        assert get_result(driver) == "5"

    def test_division_flow(self, driver):
        reset_state(driver)
        js(driver, "handleNumber('8');")
        js(driver, "handleOperator('/');")
        js(driver, "handleNumber('2');")
        js(driver, "handleEquals();")
        assert get_result(driver) == "4"

    def test_decimal_addition_flow(self, driver):
        reset_state(driver)
        js(driver, "handleNumber('1'); handleDecimal(); handleNumber('5');")
        js(driver, "handleOperator('+');")
        js(driver, "handleNumber('2'); handleDecimal(); handleNumber('5');")
        js(driver, "handleEquals();")
        assert get_result(driver) == "4"

    def test_percent_in_operation(self, driver):
        reset_state(driver)
        js(driver, "handleNumber('2'); handleNumber('0');")
        js(driver, "handleOperator('*');")
        js(driver, "handleNumber('5'); handlePercent();")  # 5% = 0.05
        js(driver, "handleEquals();")
        # 20 * 0.05 = 1
        assert get_result(driver) == "1"

    def test_expression_string_after_equals(self, driver):
        reset_state(driver)
        js(driver, "handleNumber('3');")
        js(driver, "handleOperator('+');")
        js(driver, "handleNumber('4');")
        js(driver, "handleEquals();")
        expr = get_expression(driver)
        assert "=" in expr
        assert "7" in get_result(driver)

    def test_state_reset_after_equals(self, driver):
        reset_state(driver)
        js(driver, "handleNumber('2');")
        js(driver, "handleOperator('+');")
        js(driver, "handleNumber('3');")
        js(driver, "handleEquals();")
        op = js(driver, "return state.operator;")
        assert op is None
        shouldReset = js(driver, "return state.shouldResetCurrent;")
        assert shouldReset is True
