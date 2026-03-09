using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JwtWebApi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRiskAndFraudEnrichment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "VehicleRiskScore",
                table: "Vehicles",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "FraudRiskLevel",
                table: "Claims",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "FraudScore",
                table: "Claims",
                type: "int",
                nullable: false,
                defaultValue: 0);

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.DropColumn(
                name: "VehicleRiskScore",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "FraudRiskLevel",
                table: "Claims");

            migrationBuilder.DropColumn(
                name: "FraudScore",
                table: "Claims");
        }
    }
}
