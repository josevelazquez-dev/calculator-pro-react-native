import type { CalculationEntry } from '@/domain/entities';
import type { HistoryRepository } from '@/domain/ports';
import { HistoryLocalDataSource } from '@/data/datasources';

export class HistoryRepositoryImpl implements HistoryRepository {
  private dataSource = new HistoryLocalDataSource();

  async getHistory(): Promise<CalculationEntry[]> {
    return this.dataSource.getHistory();
  }

  async addEntry(entry: CalculationEntry): Promise<void> {
    const entries = this.dataSource.getHistory();
    entries.unshift(entry);
    this.dataSource.saveHistory(entries);
  }

  async clearHistory(): Promise<void> {
    this.dataSource.clearHistory();
  }

  async deleteEntry(id: string): Promise<void> {
    const entries = this.dataSource.getHistory();
    const filtered = entries.filter((e) => e.id !== id);
    this.dataSource.saveHistory(filtered);
  }
}
