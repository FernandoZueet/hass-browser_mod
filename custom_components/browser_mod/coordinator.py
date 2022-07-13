import logging

from homeassistant.helpers.update_coordinator import (
    DataUpdateCoordinator,
)

_LOGGER = logging.getLogger(__name__)


class Coordinator(DataUpdateCoordinator):
    def __init__(self, hass, deviceID):
        super().__init__(
            hass,
            _LOGGER,
            name="Browser Mod Coordinator",
        )
        self.deviceID = deviceID
