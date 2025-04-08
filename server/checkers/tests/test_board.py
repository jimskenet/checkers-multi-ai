import unittest
import json
from server.checkers.board import Board

class TestBoardSerialization(unittest.TestCase):

    def test_serialized_json(self):
        board = Board()
        serialized_board = board.serialized
        
        try:
            # Ensure board serialization creates a valid JSON
            json_string = json.dumps(serialized_board, indent=2)
            self.assertIsNotNone(json_string)  # Check if JSON string is created
            print(json_string)
            
            # Ensure deserialization works correctly
            python_obj = json.loads(json_string)
            self.assertIsNotNone(python_obj)  # Check if deserialization works
            
            # Check if serialized content matches expected structure
            self.assertIsInstance(python_obj, list)
            self.assertTrue(all(isinstance(row, list) for row in python_obj))
            self.assertTrue(all(isinstance(cell, dict) for row in python_obj for cell in row))
            self.assertTrue(all('color' in cell and ('king' in cell or cell['color'] is None) for row in python_obj for cell in row))
            
        except (TypeError, json.JSONDecodeError) as e:
            self.fail(f"Serialization failed: {e}")

if __name__ == '__main__':
    unittest.main()
