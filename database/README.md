# Database Population Instructions

## Overview
This script populates the Supabase database with realistic test data for authenticated users while excluding Guest entries.

## Files Created
- `populate-data.sql` - Main population script
- `README.md` - This instruction file

## Execution Steps

### 1. Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query

### 2. Execute the Script
1. Copy the entire contents of `populate-data.sql`
2. Paste into the SQL editor
3. Click **Run** to execute all statements
4. Verify success messages for each INSERT operation

### 3. Verify Data Population
Run the verification queries at the bottom of the script to ensure:
- ✅ 10 users created (no Guest ID 000000)
- ✅ 20+ games created across different skill levels
- ✅ Proper foreign key relationships maintained
- ✅ 0 Guest entries in the database

## Data Characteristics

### User Distribution
- **3 Expert Players**: 45,000-55,000 points, 25-35 seconds
- **2 Advanced Players**: 28,000-31,000 points, 45-58 seconds
- **3 Intermediate Players**: 16,000-21,000 points, 62-75 seconds
- **2 Beginner Players**: 2,800-4,200 points, 88-120 seconds

### Game Distribution
- **20+ total games** across all users
- **Varied performance levels** from beginner to expert
- **Mixed device types**: desktop, mobile, tablet
- **Realistic timestamps** spanning different time periods

## Security Notes

### Guest User Handling
- **Guest ID**: '000000' is reserved for unauthenticated play
- **No Guest Data**: Script explicitly excludes Guest entries
- **Auth Separation**: Clear distinction between guest and authenticated users

### Data Integrity
- **Foreign Keys**: All games reference valid users
- **Consistent Names**: Player names match user profiles
- **Valid Relationships**: No orphaned game records

## Expected Results

After execution, the leaderboard should display:
1. **Rich Data**: Multiple users with varied scores and times
2. **Guest Exclusion**: Only authenticated users in populated data
3. **Real Performance**: Pagination and search work effectively
4. **Auth Integration**: Clerk authentication functions correctly

## Testing Checklist

- [ ] Leaderboard shows 10 populated users
- [ ] Guest entries are excluded from results
- [ ] Search functionality works with new data
- [ ] Pagination handles multiple pages correctly
- [ ] Player profiles display correctly
- [ ] Game statistics are accurate

## Troubleshooting

### If Script Fails
1. **Check Table Structure**: Ensure `users` and `games` tables exist
2. **Verify Column Names**: Match with schema expectations
3. **Check Foreign Keys**: Ensure `player_id` references `users.user_id`
4. **Review Permissions**: SQL editor has write access

### Common Issues
- **Foreign Key Violations**: Users table must be populated first
- **Duplicate Keys**: Each user_id must be unique
- **Missing Columns**: Verify table schema matches expectations

## Production Considerations

### For Development
- **Realistic Data**: Helps test UI with varied content
- **Performance Testing**: Multiple users test query optimization
- **Feature Validation**: Search, pagination, filters work properly

### For Production
- **Remove Test Data**: Clear before going live
- **Use Real Data**: Migrate from production user base
- **Security Review**: Ensure no sensitive test data remains

## Support

If you encounter issues:
1. Check Supabase documentation for SQL syntax
2. Verify table schema matches expectations
3. Review error messages in SQL editor
4. Test with smaller batches if needed

The database will now be populated with comprehensive test data while maintaining the Guest/Authenticated user separation.
