import sys
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "py_modules"))
import friend_locations as locations


class FriendLocationsTests(unittest.TestCase):
    def test_public_location(self):
        self.assertEqual(locations.parse_location(b"<profile><location><![CDATA[Tokyo, Japan]]></location></profile>"), "Tokyo, Japan")

    def test_private_and_missing_are_unknown(self):
        self.assertIsNone(locations.parse_location(b"<profile><privacyState>private</privacyState><location>Hidden</location></profile>"))
        self.assertIsNone(locations.parse_location(b"<profile/>"))

    def test_unsafe_or_oversized_xml(self):
        self.assertIsNone(locations.parse_location(b'<!DOCTYPE profile [<!ENTITY e "test">]><profile/>'))
        self.assertIsNone(locations.parse_location(b"x" * (locations.MAX_XML + 1)))

    def test_ids_are_bounded_validated_and_unique(self):
        ids = ["76561198000000001"] * 3 + ["not-a-steam-id", "https://example.com"] + [str(76561198000000002 + i) for i in range(30)]
        with patch.object(locations, "_lookup", return_value="Japan") as lookup:
            result = locations.lookup_many(ids)
        self.assertEqual(len(result), 20)
        self.assertEqual(lookup.call_count, 20)
        self.assertNotIn("not-a-steam-id", result)


if __name__ == "__main__":
    unittest.main()
