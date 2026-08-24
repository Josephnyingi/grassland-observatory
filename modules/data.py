"""Shared dashboard domain constants."""

import re

from services.gee_climate import county_choices


AOIS = county_choices()


def i18n_slug(label: str) -> str:
    """Turn a fixed-vocabulary label into a stable translation key fragment."""
    return re.sub(r"[^a-z0-9]+", "_", label.lower()).strip("_")
