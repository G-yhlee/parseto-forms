import type { CollectionRepository } from '../../domain/repositories/CollectionRepository';
import type { CollectionEntity } from '../../domain/entities/Collection';

/**
 * Use case for getting collections with filtering and organization
 */
export class GetCollectionsUseCase {
  constructor(private collectionRepository: CollectionRepository) {}

  async execute(searchTerm: string = ''): Promise<{
    pinned: CollectionEntity[];
    others: CollectionEntity[];
    all: CollectionEntity[];
  }> {
    // Single API call to get all collections
    console.log('GetCollectionsUseCase: Fetching all collections once');
    const all = await this.collectionRepository.findFiltered(searchTerm);
    
    // Filter in memory to avoid additional API calls
    const pinned = all.filter(collection => collection.isPinnedCollection());
    const pinnedNames = pinned.map(c => c.name);
    const others = all.filter(collection => !pinnedNames.includes(collection.name));

    console.log('GetCollectionsUseCase: Processed collections', {
      total: all.length,
      pinned: pinned.length,
      others: others.length
    });

    return {
      pinned,
      others,
      all
    };
  }
}