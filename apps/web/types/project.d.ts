export type ProjectPriorityName = "low" | "medium" | "high" | "critical"

export type ProjectPriorityWeight = 4 | 3 | 2 | 1

export type ProjectPriority = {
    id: number,
    name: ProjectPriorityName,
    weight: ProjectPriorityWeight
}