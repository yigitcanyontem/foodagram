---
sidebar_position: 2
---

# How to write aggregation queries?
<hr/>

### Aggregation Queries
- On your backend methods especially if the method visits multiple collections on the database use Aggregation queries to do all of them at once to reduce code and also speed up the function.

Here's an example of a well-structured aggregation query:

```java
@Aggregation(pipeline = {
    // Stage 1: Convert companyProfileId to ObjectId
    "{ $addFields: { convertedCompanyProfileId: { $toObjectId: \"$companyProfileId\" } } }",
    
    // Stage 2: Join with company collection
    "{ $lookup: { from: \"company\", localField: \"convertedCompanyProfileId\", foreignField: \"_id\", as: \"companyDetails\" } }",
    "{ $unwind: \"$companyDetails\" }",
    
    // Stage 3: Filter by userId
    "{ $match: { \"companyDetails.userId\": ?0 } }",
    
    // Stage 4: Convert secondHandAdId to ObjectId
    "{ $addFields: { convertedSecondHandAdId: { $toObjectId: \"$secondHandAdId\" } } }",
    
    // Stage 5: Join with secondhandAds collection
    "{ $lookup: { from: \"secondhandAds\", localField: \"convertedSecondHandAdId\", foreignField: \"_id\", as: \"secondHandAdDetails\" } }",
    "{ $unwind: \"$secondHandAdDetails\" }",
    
    // Stage 6: Get first photo ID and join with image collection
    "{ $addFields: { firstPhotoId: { $toObjectId: { $arrayElemAt: [\"$secondHandAdDetails.secondHandPhotoIdList\", 0] } } } }",
    "{ $lookup: { from: \"image\", localField: \"firstPhotoId\", foreignField: \"_id\", as: \"imageInfo\" } }",
    
    // Stage 7: Handle photo name with fallback
    "{ $addFields: { secondHandAdPhotoName: { $cond: { " +
        "if: { $or: [ " +
            "{ $and: [ { $isArray: \"$imageInfo\" }, { $gt: [ { $size: \"$imageInfo\" }, 0 ] } ] }, " +
            "{ $eq: [ { $arrayElemAt: [\"$imageInfo.name\", 0] }, \"\"] } " +
        "] }, " +
        "then: { $arrayElemAt: [\"$imageInfo.name\", 0] }, " +
        "else: \"image/dummy-image.png\" " +
    "} } } }",
    
    // Stage 8: Group for pagination
    "{ $group: { _id: null, totalItems: { $sum: 1 }, data: { $push: \"$$ROOT\" } } }",
    "{ $unwind: \"$data\" }",
    
    // Stage 9: Project final fields
    "{ $project: { " +
        "_id: \"$data._id\", " +
        "offer: \"$data.offer\", " +
        "count: \"$data.count\", " +
        "secondHandAdId: \"$data.secondHandAdId\", " +
        "secondHandAdName: \"$data.secondHandAdDetails.name\", " +
        "secondHandAdPhotoName: \"$data.secondHandAdPhotoName\", " +
        "secondHandAdPrice: \"$data.secondHandAdPrice\", " +
        "date: \"$data.date\", " +
        "totalItems: \"$totalItems\" " +
    "} }",
    
    // Stage 10: Sort, skip and limit for pagination
    "{ $sort: { ?2: ?3 } }",
    "{ $skip: ?1 }",
    "{ $limit: 20 }"
})
List<SecondHandMyOfferDto> findMyOffers(String userId, int skip, String sortBy, int directionIndex);
```

### Helper Methods for Pagination and Sorting

```java
/**
 * Converts sort direction string to MongoDB sort value
 * @param direction "asc" or "desc"
 * @return 1 for ascending, -1 for descending
 */
public int getSortDirection(String direction) {
    return "desc".equals(direction) ? -1 : 1;
}

/**
 * Calculates zero-based skip value for MongoDB pagination
 * @param pageIndex 1-based page index
 * @param pageSize number of items per page
 * @return zero-based skip value
 */
public int getZeroBasedSkip(int pageIndex, int pageSize) {
    return (pageIndex - 1) * pageSize;
}
```

### Important Notes:
1. Collection and field names must exactly match your database schema
2. Use `$project` stage to specify exactly which fields you want in the result
3. Always use proper indexing on fields used in `$match` and `$sort` stages
4. Consider using constants for collection names and field names to avoid typos
5. Break complex aggregations into stages with clear comments for better maintainability

### Best Practices:
1. Use meaningful stage names in comments
2. Group related stages together
3. Use helper methods for common operations like pagination and sorting
4. Consider performance implications of each stage
5. Test aggregation queries with different data scenarios
