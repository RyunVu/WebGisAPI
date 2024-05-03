using System;
using Microsoft.EntityFrameworkCore.Migrations;
using NetTopologySuite.Geometries;

#nullable disable

namespace WebGis.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:PostgresExtension:postgis", ",,");

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    UrlSlug = table.Column<string>(type: "text", nullable: true),
                    Actived = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Districts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    UrlSlug = table.Column<string>(type: "text", nullable: true),
                    Actived = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Districts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Plants",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    UrlSlug = table.Column<string>(type: "text", nullable: true),
                    Actived = table.Column<bool>(type: "boolean", nullable: false),
                    CategoryId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Plants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Plants_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Communes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    UrlSlug = table.Column<string>(type: "text", nullable: true),
                    Geometry = table.Column<Geometry>(type: "geometry", nullable: true),
                    Area = table.Column<float>(type: "real", nullable: false),
                    Actived = table.Column<bool>(type: "boolean", nullable: false),
                    DistrictId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Communes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Communes_Districts_DistrictId",
                        column: x => x.DistrictId,
                        principalTable: "Districts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PlantOutputs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    UrlSlug = table.Column<string>(type: "text", nullable: true),
                    Unit = table.Column<string>(type: "text", nullable: true),
                    Time = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Actived = table.Column<bool>(type: "boolean", nullable: false),
                    PlantId = table.Column<Guid>(type: "uuid", nullable: false),
                    CommuneId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlantOutputs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlantOutputs_Communes_CommuneId",
                        column: x => x.CommuneId,
                        principalTable: "Communes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PlantOutputs_Plants_PlantId",
                        column: x => x.PlantId,
                        principalTable: "Plants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Communes_DistrictId",
                table: "Communes",
                column: "DistrictId");

            migrationBuilder.CreateIndex(
                name: "IX_PlantOutputs_CommuneId",
                table: "PlantOutputs",
                column: "CommuneId");

            migrationBuilder.CreateIndex(
                name: "IX_PlantOutputs_PlantId",
                table: "PlantOutputs",
                column: "PlantId");

            migrationBuilder.CreateIndex(
                name: "IX_Plants_CategoryId",
                table: "Plants",
                column: "CategoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PlantOutputs");

            migrationBuilder.DropTable(
                name: "Communes");

            migrationBuilder.DropTable(
                name: "Plants");

            migrationBuilder.DropTable(
                name: "Districts");

            migrationBuilder.DropTable(
                name: "Categories");
        }
    }
}
