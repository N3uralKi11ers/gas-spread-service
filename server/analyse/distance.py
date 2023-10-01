from typing import List, Tuple, Optional
from schemas import EvacuationMap, Pos, BaseElement, Route

def _dfs(matrix, start, end, visited, shortest_path, path):
    rows = len(matrix)
    cols = len(matrix[0])
    
    if start == end:
        return True

    visited[start[0]][start[1]] = True

    neighbors = [(start[0]-1, start[1]), (start[0]+1, start[1]), (start[0], start[1]-1), (start[0], start[1]+1)]
    for neighbor in neighbors:
        row, col = neighbor
        if 0 <= row < rows and 0 <= col < cols:
            if matrix[row][col] == 0 and not visited[row][col]:
                if _dfs(matrix, (row, col), end, visited, shortest_path, path):
                    shortest_path[start[0]][start[1]] = shortest_path[row][col] + 1
                    path.append((row, col))
                    return True

    return False


def find_route(
    start_pos: Pos,
    end_pos: Pos,
    evacuation_map: EvacuationMap
) -> Route:
    
    matrix = evacuation_map.to_array()
    start = start_pos.to_tuple_yx()
    end = end_pos.to_tuple_yx()
    
    rows = len(matrix)
    cols = len(matrix[0])
    

    visited = [[False for _ in range(cols)] for _ in range(rows)]
    shortest_path = [[float('inf') for _ in range(cols)] for _ in range(rows)]
    shortest_path[start[0]][start[1]] = 0

    path = [start]

    if _dfs(matrix, start, end, visited, shortest_path, path):
        path = path[1:] + [path[0]]
        path = list(reversed(path))
        return Route(points=[Pos(x=p[1], y=p[0]) for p in path])
    
    return []


# Calculate absolute distance
def calculate_distance(route: List[Tuple[int, int]]) -> int:
    return len(route)


# Calculate relative distance
def calculate_weighted_distance(start_pos: Pos, end_pos: Pos, evacuation_map: EvacuationMap) -> int:
    _route = find_route(start_pos, end_pos, evacuation_map)
    return len(_route)


